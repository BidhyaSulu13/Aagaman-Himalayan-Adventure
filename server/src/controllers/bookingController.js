import crypto from "crypto";
import { Booking } from "../models/Booking.js";
import { Departure } from "../models/Departure.js";
import { Review } from "../models/Review.js";
import { Trek } from "../models/Trek.js";
import {
  notifyBookingConfirmed,
  notifyBookingReceived,
  notifyTrekCompleted,
} from "../services/bookingEmailService.js";
import { getNepalDateKey } from "../utils/nepalTime.js";

// Helper to generate unique booking reference
function generateBookingReference() {
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `BK-${new Date().getFullYear()}-${randomSuffix}`;
}

function getFirstBookableStartDate() {
  const [year, month, day] = getNepalDateKey().split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1));
}

async function releaseDepartureSeats(departureId, seatCount) {
  if (!departureId || !Number.isInteger(seatCount) || seatCount < 1) return null;
  return Departure.findOneAndUpdate(
    {
      _id: departureId,
      $expr: { $gte: [{ $ifNull: ["$bookedCount", 0] }, seatCount] },
    },
    { $inc: { bookedCount: -seatCount } },
    { new: true },
  );
}

async function reserveDepartureSeats(departureId, seatCount) {
  const now = new Date();
  const todayNepalKey = getNepalDateKey(now);
  return Departure.findOneAndUpdate(
    {
      _id: departureId,
      published: { $ne: false },
      status: { $in: ["Available", "Guaranteed", "Filling Fast"] },
      // Date-only departure dates are stored at UTC midnight. Compare against
      // the next Nepal calendar date so today's departure cannot be reserved.
      startDate: { $gte: getFirstBookableStartDate() },
      endDate: { $gte: now },
      $or: [
        { bookingClosingDate: { $exists: false } },
        { bookingClosingDate: null },
        { bookingClosingDate: { $gte: new Date(`${todayNepalKey}T00:00:00.000Z`) } },
      ],
      $expr: {
        $lte: [
          { $add: [{ $ifNull: ["$bookedCount", 0] }, seatCount] },
          "$capacity",
        ],
      },
    },
    { $inc: { bookedCount: seatCount } },
    { new: true },
  );
}

function ownsBookingByVerifiedEmail(booking, user) {
  return user?.role === "traveler" &&
    user.emailVerified === true &&
    booking.travelerDetails.some(
      (traveler) => traveler.email.toLowerCase() === user.email.toLowerCase()
    );
}

async function getCompletionValidationError(booking, departureId = booking.departure) {
  if (booking.bookingStatus !== "Confirmed") {
    return "Only confirmed bookings can be marked Completed.";
  }
  const departure = await Departure.findById(departureId);
  if (
    !departure ||
    Number.isNaN(new Date(departure.endDate).getTime()) ||
    getNepalDateKey(departure.endDate) >= getNepalDateKey()
  ) {
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
    details = details.map((detail) => ({
      ...detail,
      fullName: String(detail.fullName || "").trim(),
      email: String(detail.email || "").trim().toLowerCase(),
    }));
    if (details.some((detail) =>
      !detail.fullName ||
      detail.fullName.length > 120 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(detail.email) ||
      detail.email.length > 254
    )) {
      return res.status(400).json({
        success: false,
        message: "Every traveler must have a valid name and email address.",
      });
    }

    if (!departureId) {
      return res.status(400).json({
        success: false,
        message: "Select an admin-published fixed departure before booking.",
      });
    }

    // 2. Load and validate the admin-published departure.
    const departure = await Departure.findById(departureId).populate("trek");
    if (!departure) {
      return res.status(404).json({
        success: false,
        message: "Selected group departure was not found.",
      });
    }
    if (!departure.published) {
      return res.status(409).json({
        success: false,
        message: "This departure has not been published for booking.",
      });
    }

    const trek = departure.trek;
    if (!trek) {
      return res.status(404).json({
        success: false,
        message: "Target trek package was not found.",
      });
    }
    if (
      (trekId && trekId.toString() !== trek._id.toString()) ||
      (trekSlug && trekSlug !== trek.slug)
    ) {
      return res.status(400).json({
        success: false,
        message: "The selected departure does not belong to this trek package.",
      });
    }

    const departureStart = new Date(departure.startDate);
    const requestedDate = startDate ? new Date(startDate) : departureStart;
    const departureDateKey = getNepalDateKey(departure.startDate);
    const endDateKey = getNepalDateKey(departure.endDate);
    const todayNepalKey = getNepalDateKey();
    if (
      Number.isNaN(requestedDate.getTime()) ||
      requestedDate.toISOString().slice(0, 10) !== departureStart.toISOString().slice(0, 10) ||
      departureDateKey <= todayNepalKey ||
      endDateKey < todayNepalKey
    ) {
      return res.status(409).json({
        success: false,
        message: "This departure date is invalid or has already started.",
      });
    }
    if (
      !["Available", "Guaranteed", "Filling Fast"].includes(departure.status) ||
      !["Open", "Limited Seats", "Guaranteed"].includes(departure.lifecycleStatus)
    ) {
      return res.status(409).json({
        success: false,
        message: "This group departure is closed, cancelled, or no longer available for booking.",
      });
    }

    // 3. Group capacity check
    const currentBooked = Math.max(0, departure.bookedCount || 0);
    const availableSeats = Math.max(0, departure.capacity - currentBooked);

    if (currentBooked + travelerCount > departure.capacity) {
      return res.status(400).json({
        success: false,
        message: `Group capacity exceeded. Only ${availableSeats} seat(s) remaining for this departure date.`,
      });
    }

    // 4. Backend-calculated pricing (Never trust client totalAmount)
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
        published: { $ne: false },
        status: { $in: ["Available", "Guaranteed", "Filling Fast"] },
        startDate: { $gte: getFirstBookableStartDate() },
        endDate: { $gte: new Date() },
        $or: [
          { bookingClosingDate: { $exists: false } },
          { bookingClosingDate: null },
          { bookingClosingDate: { $gt: new Date() } },
        ],
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

    void notifyBookingReceived(booking._id);

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
    const bookingAccess = [{ user: req.user._id }];
    if (req.user.role === "traveler" && req.user.emailVerified === true) {
      const escapedEmail = req.user.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      bookingAccess.push({
        "travelerDetails.email": new RegExp(`^${escapedEmail}$`, "i"),
      });
    }
    const bookings = await Booking.find({
      $or: bookingAccess,
    })
      .populate("trek", "title slug region duration images price difficulty")
      .populate("departure")
      .sort({ createdAt: -1 });
    const reviews = await Review.find({
      booking: { $in: bookings.map((booking) => booking._id) },
    }).select("booking departure title rating comment photos moderationStatus verificationStatus createdAt");
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
        ownsBookingByVerifiedEmail(booking, req.user));
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
        ownsBookingByVerifiedEmail(booking, req.user));
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking.",
      });
    }

    if (booking.bookingStatus === "Completed") {
      return res.status(409).json({
        success: false,
        message: "Completed bookings cannot be cancelled.",
      });
    }

    const cancelledBooking = await Booking.findOneAndUpdate(
      { _id: booking._id, bookingStatus: { $ne: "Cancelled" } },
      {
        $set: {
          bookingStatus: "Cancelled",
          cancellationReason: reason || "Cancelled by traveler",
        },
      },
      { new: true },
    );
    if (cancelledBooking) {
      const released = await releaseDepartureSeats(
        booking.departure,
        booking.numberOfTravelers
      );
      if (!released) {
        console.error(`Unable to release reserved seats for cancelled booking ${booking.bookingReference}.`);
      }
    }

    res.json({
      success: true,
      booking: cancelledBooking || await Booking.findById(booking._id),
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
    const previousStatus = booking.bookingStatus;

    if (bookingStatus === "Completed" && bookingStatus !== booking.bookingStatus) {
      const validationError = await getCompletionValidationError(booking);
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
      }
    }

    if (bookingStatus && bookingStatus !== booking.bookingStatus) {
      if (!["Pending", "Requested", "Pending confirmation", "Confirmed", "Cancelled", "Completed"].includes(bookingStatus)) {
        return res.status(400).json({ success: false, message: "Invalid booking status." });
      }
      if (booking.bookingStatus === "Completed" && bookingStatus === "Cancelled") {
        return res.status(409).json({ success: false, message: "Completed bookings cannot be cancelled." });
      }
      if (bookingStatus === "Cancelled" && booking.bookingStatus !== "Cancelled") {
        const transitioned = await Booking.findOneAndUpdate(
          { _id: booking._id, bookingStatus: booking.bookingStatus },
          { $set: { bookingStatus: "Cancelled", cancellationReason: "Cancelled by admin" } },
          { new: true },
        );
        if (!transitioned) {
          return res.status(409).json({ success: false, message: "Booking status changed. Refresh and retry." });
        }
        booking.bookingStatus = transitioned.bookingStatus;
        const released = await releaseDepartureSeats(booking.departure, booking.numberOfTravelers);
        if (!released) {
          console.error(`Unable to release reserved seats for cancelled booking ${booking.bookingReference}.`);
        }
      } else if (booking.bookingStatus === "Cancelled" && bookingStatus !== "Cancelled") {
        const reserved = await reserveDepartureSeats(booking.departure, booking.numberOfTravelers);
        if (!reserved) {
          return res.status(409).json({
            success: false,
            message: "The departure is no longer bookable or has insufficient remaining seats.",
          });
        }
        const transitioned = await Booking.findOneAndUpdate(
          { _id: booking._id, bookingStatus: "Cancelled" },
          { $set: { bookingStatus } },
          { new: true },
        );
        if (!transitioned) {
          await releaseDepartureSeats(booking.departure, booking.numberOfTravelers);
          return res.status(409).json({ success: false, message: "Booking status changed. Refresh and retry." });
        }
        booking.bookingStatus = transitioned.bookingStatus;
      } else {
        booking.bookingStatus = bookingStatus;
      }
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    if (paymentReference) {
      booking.paymentReference = paymentReference;
    }

    await booking.save();
    if (booking.bookingStatus === "Confirmed" && previousStatus !== "Confirmed") {
      void notifyBookingConfirmed(booking._id);
    }
    if (booking.bookingStatus === "Completed" && previousStatus !== "Completed") {
      void notifyTrekCompleted(booking._id);
    }

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

    const previousDepartureId = booking.departure?.toString();
    const previousTravelers = booking.numberOfTravelers || 1;
    const previousStatus = booking.bookingStatus;
    const nextStatus = bookingStatus || previousStatus;
    const newTravelers = numberOfTravelers === undefined
      ? previousTravelers
      : Number(numberOfTravelers);
    if (!Number.isInteger(newTravelers) || newTravelers < 1 || newTravelers > 20) {
      return res.status(400).json({
        success: false,
        message: "Traveler count must be between 1 and 20 participants.",
      });
    }

    const nextDepartureId = departureId || previousDepartureId;
    const departureChanged = nextDepartureId !== previousDepartureId;
    if (departureChanged) {
      const newDeparture = await Departure.findById(nextDepartureId);
      if (!newDeparture) {
        return res.status(404).json({ success: false, message: "New departure date not found." });
      }
      if (newDeparture.trek.toString() !== booking.trek._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "The selected departure belongs to a different trek.",
        });
      }
    }

    const currentlyReserved = previousStatus !== "Cancelled";
    const willBeReserved = nextStatus !== "Cancelled";
    const additionalSeats = willBeReserved
      ? !currentlyReserved || departureChanged
        ? newTravelers
        : Math.max(0, newTravelers - previousTravelers)
      : 0;
    if (additionalSeats > 0) {
      const reserved = await reserveDepartureSeats(nextDepartureId, additionalSeats);
      if (!reserved) {
        return res.status(409).json({
          success: false,
          message: "The selected departure is no longer bookable or has insufficient remaining seats.",
        });
      }
    }

    if (travelerDetails && Array.isArray(travelerDetails)) {
      booking.travelerDetails = travelerDetails;
    }
    booking.departure = nextDepartureId;
    booking.numberOfTravelers = newTravelers;
    booking.bookingStatus = nextStatus;
    if (nextStatus === "Cancelled" && previousStatus !== "Cancelled") {
      booking.cancellationReason = "Cancelled by admin";
    }

    if (totalAmount !== undefined && !isNaN(Number(totalAmount))) {
      booking.totalAmount = Number(totalAmount);
    } else if (departureChanged || newTravelers !== previousTravelers) {
      const dep = await Departure.findById(nextDepartureId);
      const pricePerPax = dep?.price || booking.trek?.price || 1500;
      booking.totalAmount = pricePerPax * newTravelers;
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    if (notes !== undefined) {
      booking.notes = notes;
    }

    try {
      await booking.save();
    } catch (error) {
      if (additionalSeats > 0) {
        await releaseDepartureSeats(nextDepartureId, additionalSeats);
      }
      throw error;
    }
    if (nextStatus === "Confirmed" && previousStatus !== "Confirmed") {
      void notifyBookingConfirmed(booking._id);
    }
    if (nextStatus === "Completed" && previousStatus !== "Completed") {
      void notifyTrekCompleted(booking._id);
    }

    const seatsToRelease = currentlyReserved
      ? !willBeReserved || departureChanged
        ? previousTravelers
        : Math.max(0, previousTravelers - newTravelers)
      : 0;
    if (seatsToRelease > 0) {
      const released = await releaseDepartureSeats(previousDepartureId, seatsToRelease);
      if (!released) {
        console.error(`Unable to release reserved seats while updating booking ${booking.bookingReference}.`);
      }
    }

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
