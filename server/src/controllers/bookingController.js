import crypto from "crypto";
import { Booking } from "../models/Booking.js";
import { Departure } from "../models/Departure.js";
import { Review } from "../models/Review.js";
import { Trek } from "../models/Trek.js";
import { sendBookingConfirmationEmail } from "../services/emailService.js";

// Helper to generate unique booking reference
function generateBookingReference() {
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `BK-${new Date().getFullYear()}-${randomSuffix}`;
}

async function getCompletionValidationError(booking, departureId = booking.departure) {
  if (booking.bookingStatus !== "Confirmed") {
    return "Only confirmed bookings can be marked Completed.";
  }
  const departure = await Departure.findById(departureId);
  const endOfDeparture = departure ? new Date(departure.endDate) : null;
  endOfDeparture?.setUTCHours(23, 59, 59, 999);
  if (!endOfDeparture || Number.isNaN(endOfDeparture.getTime()) || endOfDeparture > new Date()) {
    return "A booking can be marked Completed only after its departure has ended.";
  }
  return null;
}

// POST /api/bookings
export async function createBooking(req, res, next) {
  try {
    const {
      departureId,
      trekSlug,
      trekId,
      travelers,
      travelerDetails,
      startDate,
      addons,
      notes,
    } = req.body;

    // 1. Participant limits validation
    const travelerCount = Number(travelers) || 1;
    if (travelerCount < 1 || travelerCount > 20) {
      return res.status(400).json({
        success: false,
        message: "Traveler count must be between 1 and 20 participants.",
      });
    }

    // Prepare traveler details array
    let details = Array.isArray(travelerDetails) ? [...travelerDetails] : [];
    if (details.length === 0) {
      // If client sent top-level traveler contact info
      if (req.body.fullName || req.body.name || req.body.email) {
        details.push({
          fullName: req.body.fullName || req.body.name || req.user?.name || "Lead Trekker",
          email: req.body.email || req.user?.email || "trekker@example.com",
          phone: req.body.phone || "",
          passportNumber: req.body.passportNumber || "",
          nationality: req.body.country || req.body.nationality || "International",
          dietaryRequirements: req.body.dietary || req.body.dietaryRequirements || "None",
          emergencyContact: req.body.emergencyContact?.name
            ? `${req.body.emergencyContact.name} (${req.body.emergencyContact.phone || ""})`
            : "",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "At least one traveler's full contact details must be provided.",
        });
      }
    }

    // Fill placeholder info for remaining group members if only lead was filled
    while (details.length < travelerCount) {
      details.push({
        fullName: `Participant ${details.length + 1} (${details[0].fullName}'s Group)`,
        email: details[0].email,
        phone: details[0].phone || "",
        passportNumber: "",
        nationality: details[0].nationality || "",
        dietaryRequirements: "None",
        emergencyContact: details[0].emergencyContact || "",
      });
    }

    // 2. Look up departure and trek
    let departure = null;
    if (departureId) {
      departure = await Departure.findById(departureId).populate("trek");
      if (!departure) {
        return res.status(404).json({
          success: false,
          message: "Selected group departure was not found.",
        });
      }
    }

    let trek = null;
    if (departure && departure.trek) {
      trek = departure.trek;
    } else if (trekId) {
      trek = await Trek.findById(trekId);
    } else if (trekSlug) {
      trek = await Trek.findOne({ slug: trekSlug });
    }

    if (!trek) {
      return res.status(404).json({
        success: false,
        message: "Target trek package was not found.",
      });
    }

    if (departure && !["Available", "Guaranteed", "Filling Fast"].includes(departure.status)) {
      return res.status(409).json({
        success: false,
        message: "This group departure is no longer available for booking.",
      });
    }

    // 3. Date validation & Departure allocation
    let requestedDate = null;
    if (departure) {
      requestedDate = new Date(departure.startDate);
    } else if (startDate) {
      requestedDate = new Date(startDate);
    } else {
      requestedDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days ahead default
    }

    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid departure date provided.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Selected departure date must be today or in the future.",
      });
    }

    // If no departure was found/selected, find an existing one for that trek and date or create one
    if (!departure) {
      departure = await Departure.findOne({
        trek: trek._id,
        startDate: {
          $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
          $lte: new Date(requestedDate.setHours(23, 59, 59, 999)),
        },
      });

      if (!departure) {
        const trekDuration = trek.duration || 14;
        const endDate = new Date(requestedDate.getTime() + trekDuration * 24 * 60 * 60 * 1000);
        const groupCap = trek.groupCapacity || 12;

        departure = await Departure.create({
          trek: trek._id,
          startDate: requestedDate,
          endDate,
          capacity: groupCap,
          bookedCount: 0,
          price: trek.price,
          status: "Available",
        });
      }
    }

    // 4. Group capacity check
    const currentBooked = Math.max(0, departure.bookedCount || 0);
    const availableSeats = Math.max(0, departure.capacity - currentBooked);

    if (currentBooked + travelerCount > departure.capacity) {
      return res.status(400).json({
        success: false,
        message: `Group capacity exceeded. Only ${availableSeats} seat(s) remaining for this departure date.`,
      });
    }

    // 5. Backend-calculated pricing (Never trust client totalAmount)
    const baseRate = departure.price || trek.price;
    // Standard tiered pricing
    let paxMultiplier = 1.0;
    if (travelerCount === 1) paxMultiplier = 1.2;
    else if (travelerCount <= 4) paxMultiplier = 1.1;
    else if (travelerCount <= 9) paxMultiplier = 1.05;
    else paxMultiplier = 1.0;

    const perPersonPrice = Math.round(baseRate * paxMultiplier);
    let totalAmount = perPersonPrice * travelerCount;

    // Add-ons server-side calculation
    if (addons && typeof addons === "object") {
      if (addons.singleRoom) totalAmount += 250;
      if (addons.extraPorter) totalAmount += 180;
      if (addons.airportTransfer) totalAmount += 45;
      if (addons.gearRental) totalAmount += 35 * travelerCount;
      if (addons.heliReturn) totalAmount += 650 * travelerCount;
    }

    // Reserve seats atomically so concurrent bookings cannot exceed group capacity.
    const allocatedDeparture = await Departure.findOneAndUpdate(
      {
        _id: departure._id,
        status: { $in: ["Available", "Guaranteed", "Filling Fast"] },
        $expr: {
          $lte: [
            { $add: [{ $ifNull: ["$bookedCount", 0] }, travelerCount] },
            "$capacity",
          ],
        },
      },
      { $inc: { bookedCount: travelerCount } },
      { new: true }
    );
    if (!allocatedDeparture) {
      return res.status(409).json({
        success: false,
        message: "This departure has just filled or closed. Please select another date.",
      });
    }
    departure.bookedCount = allocatedDeparture.bookedCount;

    // 7. Save Booking with status: "Pending" & payment: "Pending" (or "Unpaid")
    // Non-negotiable: Never auto-mark as paid without payment gateway verification
    const bookingRef = generateBookingReference();
    const primaryTraveler = details[0];

    let booking;
    try {
      booking = await Booking.create({
        bookingReference: bookingRef,
        user: req.user ? req.user._id : null,
        departure: departure._id,
        trek: trek._id,
        travelerDetails: details,
        numberOfTravelers: travelerCount,
        totalAmount,
        currency: "USD",
        bookingStatus: "Pending",
        paymentStatus: "Pending",
        notes: notes || req.body.specialRequests || "",
      });
    } catch (error) {
      await Departure.findOneAndUpdate(
        { _id: departure._id, bookedCount: { $gte: travelerCount } },
        { $inc: { bookedCount: -travelerCount } }
      );
      throw error;
    }

    const populated = await booking.populate([
      { path: "trek", select: "title slug region duration images price difficulty" },
      { path: "departure" },
    ]);

    // Asynchronous email notification
    sendBookingConfirmationEmail({
      email: primaryTraveler.email,
      travelerName: primaryTraveler.fullName,
      bookingReference: bookingRef,
      trekTitle: trek.title,
      startDate: departure.startDate ? new Date(departure.startDate).toDateString() : "TBD",
      totalAmount,
    });

    res.status(201).json({
      success: true,
      booking: populated,
      message: `Booking reservation submitted with status 'Pending'. Your booking reference is ${bookingRef}.`,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/bookings/my (Logged-in traveler's bookings)
export async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({
      $or: [
        { user: req.user._id },
        { "travelerDetails.email": req.user.email.toLowerCase() },
      ],
    })
      .populate("trek", "title slug region duration images price difficulty")
      .populate("departure")
      .sort({ createdAt: -1 });
    const reviews = await Review.find({
      booking: { $in: bookings.map((booking) => booking._id) },
    }).select("booking title rating moderationStatus");
    const reviewsByBooking = new Map(
      reviews.map((review) => [review.booking.toString(), review])
    );

    res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.map((booking) => ({
        ...booking.toObject(),
        review: reviewsByBooking.get(booking._id.toString()) || null,
      })),
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/bookings/:id
export async function getBookingById(req, res, next) {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("trek")
      .populate("departure")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    const isOwner =
      req.user &&
      ((booking.user && booking.user._id.toString() === req.user._id.toString()) ||
        booking.travelerDetails.some(
          (t) => t.email.toLowerCase() === req.user.email.toLowerCase()
        ));
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking.",
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/bookings/:id/cancel (User cancellation request)
export async function cancelBookingRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    const isOwner =
      req.user &&
      ((booking.user && booking.user.toString() === req.user._id.toString()) ||
        booking.travelerDetails.some(
          (t) => t.email.toLowerCase() === req.user.email.toLowerCase()
        ));
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking.",
      });
    }

    if (booking.bookingStatus !== "Cancelled") {
      booking.bookingStatus = "Cancelled";
      booking.cancellationReason = reason || "Cancelled by traveler";
      await booking.save();

      // Release seats on departure safely (never let bookedCount drop below zero)
      const dep = await Departure.findById(booking.departure);
      if (dep) {
        dep.bookedCount = Math.max(0, (dep.bookedCount || 0) - booking.numberOfTravelers);
        await dep.save();
      }
    }

    res.json({
      success: true,
      booking,
      message: "Booking cancellation request processed.",
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/bookings (Admin: search by ID, customer name, email; filter by status, payment, trek)
export async function getAllBookings(req, res, next) {
  try {
    const { status, paymentStatus, trek, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== "All") query.bookingStatus = status;
    if (paymentStatus && paymentStatus !== "All") query.paymentStatus = paymentStatus;
    if (trek && trek !== "All") query.trek = trek;

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { bookingReference: { $regex: s, $options: "i" } },
        { "travelerDetails.fullName": { $regex: s, $options: "i" } },
        { "travelerDetails.email": { $regex: s, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate("trek", "title slug region images price difficulty")
        .populate("departure")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Booking.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      bookings,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/bookings/:id/status (Admin quick status update: Confirm, Cancel, Completed, Paid)
export async function updateBookingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus, paymentReference } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (bookingStatus === "Completed" && bookingStatus !== booking.bookingStatus) {
      const validationError = await getCompletionValidationError(booking);
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
      }
    }

    if (bookingStatus && bookingStatus !== booking.bookingStatus) {
      // If moving to Cancelled from non-cancelled, decrement departure booked count
      if (bookingStatus === "Cancelled" && booking.bookingStatus !== "Cancelled") {
        const dep = await Departure.findById(booking.departure);
        if (dep) {
          dep.bookedCount = Math.max(0, (dep.bookedCount || 0) - booking.numberOfTravelers);
          await dep.save();
        }
      }
      // If un-cancelling a booking back to Pending or Confirmed, increment booked count
      else if (booking.bookingStatus === "Cancelled" && bookingStatus !== "Cancelled") {
        await Departure.findByIdAndUpdate(booking.departure, {
          $inc: { bookedCount: booking.numberOfTravelers },
        });
      }
      booking.bookingStatus = bookingStatus;
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    if (paymentReference) {
      booking.paymentReference = paymentReference;
    }

    await booking.save();

    const populated = await booking.populate([
      { path: "trek", select: "title slug region images" },
      { path: "departure" },
      { path: "user", select: "name email" },
    ]);

    res.json({
      success: true,
      booking: populated,
      message: `Booking ${booking.bookingReference} updated to '${booking.bookingStatus}' / '${booking.paymentStatus}'.`,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/bookings/:id (Admin full update: participants, departure date, pricing, notes)
export async function updateBookingDetails(req, res, next) {
  try {
    const { id } = req.params;
    const {
      travelerDetails,
      numberOfTravelers,
      departureId,
      bookingStatus,
      paymentStatus,
      totalAmount,
      notes,
    } = req.body;

    const booking = await Booking.findById(id).populate("trek");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }
    if (bookingStatus === "Completed" && bookingStatus !== booking.bookingStatus) {
      const validationError = await getCompletionValidationError(
        booking,
        departureId || booking.departure
      );
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
      }
    }

    const prevDepartureId = booking.departure?.toString();
    const prevTravelers = booking.numberOfTravelers || 1;
    const newTravelers = Number(numberOfTravelers) || prevTravelers;

    // Handle departure change
    if (departureId && departureId !== prevDepartureId) {
      const newDep = await Departure.findById(departureId);
      if (!newDep) {
        return res.status(404).json({ success: false, message: "New departure date not found." });
      }

      if (booking.bookingStatus !== "Cancelled") {
        // Release seats on previous departure
        const oldDep = await Departure.findById(prevDepartureId);
        if (oldDep) {
          oldDep.bookedCount = Math.max(0, (oldDep.bookedCount || 0) - prevTravelers);
          await oldDep.save();
        }
        // Allocate seats on new departure
        await Departure.findByIdAndUpdate(departureId, {
          $inc: { bookedCount: newTravelers },
        });
      }
      booking.departure = departureId;
    } else if (newTravelers !== prevTravelers && booking.bookingStatus !== "Cancelled") {
      const diff = newTravelers - prevTravelers;
      const dep = await Departure.findById(booking.departure);
      if (dep) {
        dep.bookedCount = Math.max(0, (dep.bookedCount || 0) + diff);
        await dep.save();
      }
    }

    if (travelerDetails && Array.isArray(travelerDetails)) {
      booking.travelerDetails = travelerDetails;
    }
    booking.numberOfTravelers = newTravelers;

    if (totalAmount !== undefined && !isNaN(Number(totalAmount))) {
      booking.totalAmount = Number(totalAmount);
    } else if (newTravelers !== prevTravelers) {
      const dep = await Departure.findById(booking.departure);
      const pricePerPax = dep?.price || booking.trek?.price || 1500;
      booking.totalAmount = pricePerPax * newTravelers;
    }

    if (bookingStatus) {
      if (bookingStatus === "Cancelled" && booking.bookingStatus !== "Cancelled") {
        const dep = await Departure.findById(booking.departure);
        if (dep) {
          dep.bookedCount = Math.max(0, (dep.bookedCount || 0) - booking.numberOfTravelers);
          await dep.save();
        }
      } else if (booking.bookingStatus === "Cancelled" && bookingStatus !== "Cancelled") {
        await Departure.findByIdAndUpdate(booking.departure, {
          $inc: { bookedCount: booking.numberOfTravelers },
        });
      }
      booking.bookingStatus = bookingStatus;
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    if (notes !== undefined) {
      booking.notes = notes;
    }

    await booking.save();

    const populated = await booking.populate([
      { path: "trek", select: "title slug region images" },
      { path: "departure" },
      { path: "user", select: "name email" },
    ]);

    res.json({
      success: true,
      booking: populated,
      message: `Booking ${booking.bookingReference} updated successfully.`,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/bookings/:id (Admin delete booking)
export async function deleteBooking(req, res, next) {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    // Release seats if booking was not cancelled
    if (booking.bookingStatus !== "Cancelled" && booking.departure) {
      const dep = await Departure.findById(booking.departure);
      if (dep) {
        dep.bookedCount = Math.max(0, (dep.bookedCount || 0) - booking.numberOfTravelers);
        await dep.save();
      }
    }

    await Booking.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Booking ${booking.bookingReference} deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
}
