import crypto from "crypto";
import { Booking } from "../models/Booking.js";
import { Departure } from "../models/Departure.js";
import { Trek } from "../models/Trek.js";
import { sendBookingConfirmationEmail } from "../services/emailService.js";

// Helper to generate unique booking reference
function generateBookingReference() {
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `BK-${new Date().getFullYear()}-${randomSuffix}`;
}

// POST /api/bookings
export async function createBooking(req, res, next) {
  try {
    const {
      departureId,
      trekSlug,
      travelers,
      travelerDetails,
      notes,
    } = req.body;

    const travelerCount = Number(travelers) || 1;
    if (travelerCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Traveler count must be at least 1.",
      });
    }

    if (!travelerDetails || !Array.isArray(travelerDetails) || travelerDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one traveler's full details must be provided.",
      });
    }

    // 1. Look up departure and trek
    let departure = null;
    if (departureId) {
      departure = await Departure.findById(departureId).populate("trek");
    }

    // If no departure provided, look up by trekSlug or create a custom requested departure
    let trek = null;
    if (departure) {
      trek = departure.trek;
    } else if (trekSlug) {
      trek = await Trek.findOne({ slug: trekSlug });
    }

    if (!trek) {
      return res.status(404).json({
        success: false,
        message: "Target trek was not found.",
      });
    }

    // If no specific departure was selected, find or create an open departure for requested dates
    if (!departure) {
      const requestedDate = req.body.startDate ? new Date(req.body.startDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      const endDate = new Date(requestedDate.getTime() + (trek.duration || 14) * 24 * 60 * 60 * 1000);

      departure = await Departure.create({
        trek: trek._id,
        startDate: requestedDate,
        endDate,
        capacity: 12,
        bookedCount: 0,
        price: trek.price,
        status: "Available",
      });
    }

    // 2. Server-side availability check
    const currentBooked = departure.bookedCount || 0;
    if (currentBooked + travelerCount > departure.capacity) {
      return res.status(400).json({
        success: false,
        message: `Not enough available seats. Only ${Math.max(0, departure.capacity - currentBooked)} seat(s) remaining for this departure.`,
      });
    }

    // 3. Server-side pricing calculation
    const pricePerPax = departure.price || trek.price;
    const totalAmount = pricePerPax * travelerCount;

    // 4. Atomic capacity update
    await Departure.findByIdAndUpdate(departure._id, {
      $inc: { bookedCount: travelerCount },
    });

    // 5. Create Booking
    const bookingRef = generateBookingReference();
    const primaryTraveler = travelerDetails[0];

    const booking = await Booking.create({
      bookingReference: bookingRef,
      user: req.user ? req.user._id : null,
      departure: departure._id,
      trek: trek._id,
      travelerDetails,
      numberOfTravelers: travelerCount,
      totalAmount,
      currency: "USD",
      bookingStatus: "Requested",
      paymentStatus: "Unpaid",
      notes: notes || "",
    });

    const populated = await booking.populate([
      { path: "trek", select: "title slug region duration images" },
      { path: "departure" },
    ]);

    // 6. Send asynchronous email confirmation
    sendBookingConfirmationEmail({
      email: primaryTraveler.email,
      travelerName: primaryTraveler.fullName,
      bookingReference: bookingRef,
      trekTitle: trek.title,
      startDate: departure.startDate ? departure.startDate.toDateString() : "TBD",
      totalAmount,
    });

    res.status(201).json({
      success: true,
      booking: populated,
      message: `Booking request created! Your booking reference is ${bookingRef}.`,
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

    res.json({
      success: true,
      count: bookings.length,
      bookings,
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

    // Only allow owner or admin
    const isOwner = req.user && (
      (booking.user && booking.user._id.toString() === req.user._id.toString()) ||
      booking.travelerDetails.some((t) => t.email.toLowerCase() === req.user.email.toLowerCase())
    );
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to view this booking." });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/bookings/:id/cancel (User requests cancellation)
export async function cancelBookingRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    // Check ownership or admin
    const isOwner = req.user && (
      (booking.user && booking.user.toString() === req.user._id.toString()) ||
      booking.travelerDetails.some((t) => t.email.toLowerCase() === req.user.email.toLowerCase())
    );
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this booking." });
    }

    booking.bookingStatus = "Cancelled";
    booking.cancellationReason = reason || "Cancelled by traveler";
    await booking.save();

    // Release seats on departure
    await Departure.findByIdAndUpdate(booking.departure, {
      $inc: { bookedCount: -booking.numberOfTravelers },
    });

    res.json({
      success: true,
      booking,
      message: "Booking cancellation request processed.",
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/bookings (Admin: view all with search, filter, pagination)
export async function getAllBookings(req, res, next) {
  try {
    const { status, paymentStatus, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== "All") query.bookingStatus = status;
    if (paymentStatus && paymentStatus !== "All") query.paymentStatus = paymentStatus;

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
        .populate("trek", "title slug region")
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

// PATCH /api/bookings/:id/status (Admin updates booking status / payment status)
export async function updateBookingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus, paymentReference } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (bookingStatus) {
      // If moving to Cancelled from non-cancelled, decrement booked count
      if (bookingStatus === "Cancelled" && booking.bookingStatus !== "Cancelled") {
        await Departure.findByIdAndUpdate(booking.departure, {
          $inc: { bookedCount: -booking.numberOfTravelers },
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

    res.json({
      success: true,
      booking,
      message: `Booking ${booking.bookingReference} status updated.`,
    });
  } catch (error) {
    next(error);
  }
}
