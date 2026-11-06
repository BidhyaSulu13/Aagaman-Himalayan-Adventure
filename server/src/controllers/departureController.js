import { Booking } from "../models/Booking.js";
import { Departure } from "../models/Departure.js";
import { Trek } from "../models/Trek.js";
import { notifyTrekCompleted } from "../services/bookingEmailService.js";
import { sendDepartureStatusEmail } from "../services/emailService.js";
import { getNepalDateKey, getNepalDayStart, getUtcDateKey } from "../utils/nepalTime.js";

const BOOKABLE_STATUSES = ["Available", "Guaranteed", "Filling Fast"];
const MIN_UPCOMING_DEPARTURES = 2;

function startOfToday() {
  return getNepalDayStart();
}

function normalizeDateOnly(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(`${parsed.toISOString().slice(0, 10)}T00:00:00.000Z`);
}

function calculateEndDate(startDate, durationDays) {
  const start = normalizeDateOnly(startDate);
  const duration = Number(durationDays);
  if (!start || !Number.isInteger(duration) || duration < 1) return null;
  start.setUTCDate(start.getUTCDate() + duration);
  return start;
}

function parseDepartureDates({ startDate, endDate, bookingClosingDate }) {
  const start = normalizeDateOnly(startDate);
  const end = normalizeDateOnly(endDate);
  const closes = bookingClosingDate ? normalizeDateOnly(bookingClosingDate) : null;

  if (
    !start ||
    !end ||
    getUtcDateKey(end) < getUtcDateKey(start)
  ) {
    return { error: "Return date must be on or after a valid departure date." };
  }
  if (bookingClosingDate && !closes) {
    return { error: "Booking closing date must be a valid date." };
  }
  if (closes && getUtcDateKey(closes) >= getUtcDateKey(start)) {
    return { error: "Booking closing date must be before the departure date." };
  }
  return { start, end, closes };
}

async function resolveTrekId(trekId, trekSlug) {
  if (trekId) {
    const trek = await Trek.findById(trekId).select("_id");
    return trek?._id || null;
  }
  if (trekSlug) {
    const trek = await Trek.findOne({ slug: trekSlug }).select("_id");
    return trek?._id || null;
  }
  return null;
}

function mapDeparturePayload(body, dates, trekId) {
  return {
    trek: trekId,
    startDate: dates.start,
    endDate: dates.end,
    bookingClosingDate: dates.closes,
    capacity: Number(body.capacity),
    minGroupSize: Number(body.minGroupSize ?? 1),
    price: Number(body.price),
    originalPrice: body.originalPrice === "" || body.originalPrice == null
      ? null
      : Number(body.originalPrice),
    status: ["Filling Fast", "Open", "Limited Seats", "Fully Booked", "In Progress"].includes(body.status)
      ? "Available"
      : body.status || "Available",
    published: body.published === undefined ? true : Boolean(body.published),
  };
}

function validateDepartureValues(values) {
  if (!Number.isInteger(values.capacity) || values.capacity < 1) {
    return "Capacity must be a whole number greater than zero.";
  }
  if (
    !Number.isInteger(values.minGroupSize) ||
    values.minGroupSize < 1 ||
    values.minGroupSize > values.capacity
  ) {
    return "Minimum group size must be a whole number between 1 and capacity.";
  }
  if (!Number.isFinite(values.price) || values.price < 0) {
    return "Price per person must be a valid non-negative amount.";
  }
  if (values.originalPrice !== null &&
      (!Number.isFinite(values.originalPrice) || values.originalPrice < 0)) {
    return "Original price must be a valid non-negative amount.";
  }
  if (!["Available", "Guaranteed", "Closed", "Cancelled", "Completed"].includes(values.status)) {
    return "Select a valid departure status.";
  }
  return null;
}

async function findDepartures(query, includeUnpublished) {
  const { trekId, trekSlug, status, dateFrom, dateTo, search } = query;
  const filter = {};

  if (!includeUnpublished) filter.published = { $ne: false };
  if (trekId) filter.trek = trekId;
  if (trekSlug) {
    const trek = await Trek.findOne({ slug: trekSlug }).select("_id");
    if (!trek) return [];
    filter.trek = trek._id;
  }
  if (dateFrom || dateTo) {
    filter.startDate = {};
    if (dateFrom) filter.startDate.$gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setUTCHours(23, 59, 59, 999);
      filter.startDate.$lte = end;
    }
  }
  if (search?.trim()) {
    const matchingTreks = await Trek.find({
      title: { $regex: search.trim(), $options: "i" },
    }).distinct("_id");
    filter.trek = { $in: matchingTreks };
  }
  if (query.upcoming !== "false") {
    filter.startDate = { ...filter.startDate, $gte: startOfToday() };
  }

  let departures = await Departure.find(filter)
    .populate("trek", "title slug region price duration difficulty images")
    .sort({ startDate: 1 });
  if (status) {
    departures = departures.filter((departure) =>
      departure.status === status || departure.lifecycleStatus === status
    );
  }
  if (query.bookable === "true") {
    departures = departures.filter((departure) =>
      BOOKABLE_STATUSES.includes(departure.status) &&
      ["Open", "Limited Seats", "Guaranteed"].includes(departure.lifecycleStatus)
    );
  }
  return departures;
}

// GET /api/departures (published departures visible to travelers)
export async function getDepartures(req, res, next) {
  try {
    const departures = await findDepartures(req.query, false);
    res.json({ success: true, count: departures.length, departures });
  } catch (error) {
    next(error);
  }
}

// GET /api/departures/:id (published departure details)
export async function getDepartureById(req, res, next) {
  try {
    const departure = await Departure.findOne({
      _id: req.params.id,
      published: { $ne: false },
    }).populate("trek", "title slug region price duration difficulty images");
    if (!departure) {
      return res.status(404).json({ success: false, message: "Published departure not found." });
    }
    res.json({ success: true, departure });
  } catch (error) {
    next(error);
  }
}

// GET /api/departures/admin (all departures, including drafts)
export async function getAdminDepartures(req, res, next) {
  try {
    const departures = await findDepartures(req.query, true);
    const bookingCounts = departures.length
      ? await Booking.aggregate([
          { $match: { departure: { $in: departures.map((departure) => departure._id) } } },
          { $group: { _id: "$departure", count: { $sum: 1 } } },
        ])
      : [];
    const countsByDeparture = new Map(
      bookingCounts.map(({ _id, count }) => [_id.toString(), count])
    );
    res.json({
      success: true,
      count: departures.length,
      departures: departures.map((departure) => ({
        ...departure.toJSON(),
        bookingCount: countsByDeparture.get(departure._id.toString()) || 0,
      })),
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/departures/admin/summary
export async function getDepartureSummary(_req, res, next) {
  try {
    const today = startOfToday();
    const [departures, publishedTreks] = await Promise.all([
      Departure.find().populate("trek", "title slug"),
      Trek.find({ published: true, isArchived: { $ne: true } }).select("title slug"),
    ]);

    const upcoming = departures.filter((departure) =>
      departure.published &&
      departure.startDate >= today &&
      departure.status !== "Cancelled"
    );
    const upcomingByTrek = new Map();
    for (const departure of upcoming) {
      const trekId = departure.trek?._id?.toString();
      if (trekId && ["Open", "Limited Seats", "Guaranteed"].includes(departure.lifecycleStatus)) {
        upcomingByTrek.set(trekId, (upcomingByTrek.get(trekId) || 0) + 1);
      }
    }
    const upcomingOpen = upcoming.filter((departure) =>
      ["Open", "Limited Seats", "Guaranteed"].includes(departure.lifecycleStatus)
    );
    const upcomingList = [...upcoming]
      .sort((a, b) => a.startDate - b.startDate)
      .slice(0, 10);

    res.json({
      success: true,
      summary: {
        totalUpcoming: upcoming.length,
        open: upcomingOpen.length,
        fullyBooked: upcoming.filter((departure) => departure.lifecycleStatus === "Fully Booked").length,
        totalBookedSeats: upcoming.reduce((total, departure) => total + departure.bookedCount, 0),
        remainingSeats: upcoming.reduce((total, departure) => total + departure.availableSeats, 0),
        completed: departures.filter((departure) => departure.lifecycleStatus === "Completed").length,
        cancelled: departures.filter((departure) => departure.status === "Cancelled").length,
        upcomingDepartures: upcomingList,
        lowDepartureTreks: publishedTreks
          .filter((trek) => (upcomingByTrek.get(trek._id.toString()) || 0) < MIN_UPCOMING_DEPARTURES)
          .map((trek) => ({
            _id: trek._id,
            title: trek.title,
            slug: trek.slug,
            upcomingCount: upcomingByTrek.get(trek._id.toString()) || 0,
          })),
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/departures (Admin)
export async function createDeparture(req, res, next) {
  try {
    const trekId = await resolveTrekId(req.body.trekId, req.body.trekSlug);
    if (!trekId) {
      return res.status(404).json({ success: false, message: "Trek not found." });
    }

    const trek = await Trek.findById(trekId).select("duration");
    const endDate = calculateEndDate(req.body.startDate, trek?.duration);
    if (!endDate) {
      return res.status(400).json({ success: false, message: "Select a valid start date and trek duration to calculate the finish date." });
    }
    const dates = parseDepartureDates({ ...req.body, endDate });
    if (dates.error) return res.status(400).json({ success: false, message: dates.error });
    const values = mapDeparturePayload(req.body, dates, trekId);
    const validationError = validateDepartureValues(values);
    if (validationError) return res.status(400).json({ success: false, message: validationError });
    if (values.status === "Completed" && getNepalDateKey(dates.end) >= getNepalDateKey()) {
      return res.status(400).json({ success: false, message: "A departure can be marked Completed only after its end date in Nepal time." });
    }

    const departure = await Departure.create(values);
    await departure.populate("trek", "title slug region");
    res.status(201).json({
      success: true,
      departure,
      message: "Departure scheduled successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/departures/:id (Admin)
export async function updateDeparture(req, res, next) {
  try {
    const departure = await Departure.findById(req.params.id);
    if (!departure) {
      return res.status(404).json({ success: false, message: "Departure not found." });
    }

    const trekId = req.body.trekId || req.body.trekSlug
      ? await resolveTrekId(req.body.trekId, req.body.trekSlug)
      : departure.trek;
    if (!trekId) return res.status(404).json({ success: false, message: "Trek not found." });
    if (trekId.toString() !== departure.trek.toString() && departure.bookedCount > 0) {
      return res.status(409).json({
        success: false,
        message: "A departure with existing bookings cannot be reassigned to another trek.",
      });
    }

    const body = { ...departure.toObject(), ...req.body };
    const trek = await Trek.findById(trekId).select("duration");
    if (!trek) return res.status(404).json({ success: false, message: "Trek not found." });
    const scheduleChanged =
      req.body.startDate !== undefined ||
      req.body.endDate !== undefined ||
      req.body.trekId !== undefined ||
      req.body.trekSlug !== undefined;
    const endDate = scheduleChanged
      ? calculateEndDate(body.startDate, trek.duration)
      : body.endDate;
    if (!endDate) {
      return res.status(400).json({ success: false, message: "Select a valid start date and trek duration to calculate the finish date." });
    }
    const dates = parseDepartureDates({ ...body, endDate });
    if (dates.error) return res.status(400).json({ success: false, message: dates.error });
    const values = mapDeparturePayload(body, dates, trekId);
    if (req.body.capacity === undefined) values.capacity = departure.capacity;
    if (req.body.minGroupSize === undefined) values.minGroupSize = departure.minGroupSize;
    if (req.body.price === undefined) values.price = departure.price;
    if (req.body.originalPrice === undefined) values.originalPrice = departure.originalPrice;
    if (req.body.status === undefined) values.status = departure.status;
    if (req.body.published === undefined) values.published = departure.published;
    if (values.capacity < departure.bookedCount) {
      return res.status(400).json({
        success: false,
        message: `Capacity cannot be lower than the ${departure.bookedCount} reserved seat(s).`,
      });
    }
    const validationError = validateDepartureValues(values);
    if (validationError) return res.status(400).json({ success: false, message: validationError });
    if (values.status === "Completed" && getNepalDateKey(dates.end) >= getNepalDateKey()) {
      return res.status(400).json({ success: false, message: "A departure can be marked Completed only after its end date in Nepal time." });
    }

    const updatedDeparture = await Departure.findOneAndUpdate(
      {
        _id: departure._id,
        $expr: {
          $lte: [{ $ifNull: ["$bookedCount", 0] }, values.capacity],
        },
      },
      { $set: values },
      { new: true, runValidators: true },
    ).populate("trek", "title slug region");
    if (!updatedDeparture) {
      return res.status(409).json({
        success: false,
        message: "Departure capacity changed while saving. Refresh and try again.",
      });
    }
    let completedBookings = 0;
    if (updatedDeparture.status === "Completed" && departure.status !== "Completed") {
      const completionResult = await Booking.updateMany(
        { departure: updatedDeparture._id, bookingStatus: "Confirmed" },
        { $set: { bookingStatus: "Completed" } },
      );
      completedBookings = completionResult.modifiedCount || 0;
      const completed = await Booking.find({
        departure: updatedDeparture._id,
        bookingStatus: "Completed",
      }).select("_id");
      completed.forEach(({ _id }) => void notifyTrekCompleted(_id));
    }
    let notificationResults = null;
    if (updatedDeparture.status === "Cancelled" && departure.status !== "Cancelled") {
      try {
        const affectedBookings = await Booking.find({
          departure: updatedDeparture._id,
          bookingStatus: { $ne: "Cancelled" },
        }).select("bookingReference travelerDetails");
        const recipients = new Map();
        for (const booking of affectedBookings) {
          for (const traveler of booking.travelerDetails) {
            const email = traveler.email?.trim();
            if (!email) continue;
            const key = `${email.toLowerCase()}:${booking._id}`;
            if (!recipients.has(key)) {
              recipients.set(key, {
                email,
                travelerName: traveler.fullName,
                bookingReference: booking.bookingReference,
              });
            }
          }
        }

        const deliveryResults = await Promise.allSettled(
          [...recipients.values()].map((recipient) =>
            sendDepartureStatusEmail({
              ...recipient,
              trekTitle: updatedDeparture.trek?.title || "Your trek departure",
              startDate: updatedDeparture.startDate.toLocaleDateString(),
              endDate: updatedDeparture.endDate.toLocaleDateString(),
              departureStatus: "Cancelled",
            })
          )
        );
        const failedNotifications = deliveryResults.filter((result) => result.status === "rejected");
        if (failedNotifications.length > 0) {
          console.error(
            `Failed to send ${failedNotifications.length} cancellation notification(s) for departure ${updatedDeparture._id}.`,
            failedNotifications.map((result) => result.reason)
          );
        }
        notificationResults = {
          sent: deliveryResults.length - failedNotifications.length,
          failed: failedNotifications.length,
        };
      } catch (notificationError) {
        console.error(
          `Unable to prepare cancellation notifications for departure ${updatedDeparture._id}:`,
          notificationError
        );
        notificationResults = { sent: 0, failed: null };
      }
    }

    res.json({
      success: true,
      departure: updatedDeparture,
      ...(updatedDeparture.status === "Completed" ? { completedBookings } : {}),
      ...(notificationResults ? { notifications: notificationResults } : {}),
      message: "Departure updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/departures/:id (Admin)
export async function deleteDeparture(req, res, next) {
  try {
    const departure = await Departure.findById(req.params.id);
    if (!departure) {
      return res.status(404).json({ success: false, message: "Departure not found." });
    }
    if (departure.bookedCount > 0) {
      return res.status(409).json({
        success: false,
        message: "This departure has reserved seats. Close or cancel it instead of deleting it.",
      });
    }
    if (await Booking.exists({ departure: departure._id })) {
      return res.status(409).json({
        success: false,
        message: "This departure has booking history. Close or cancel it instead of deleting it.",
      });
    }
    const deletedDeparture = await Departure.findOneAndDelete({
      _id: departure._id,
      $or: [
        { bookedCount: 0 },
        { bookedCount: { $exists: false } },
      ],
    });
    if (!deletedDeparture) {
      return res.status(409).json({
        success: false,
        message: "This departure now has reserved seats. Close or cancel it instead of deleting it.",
      });
    }
    res.json({ success: true, message: "Departure deleted." });
  } catch (error) {
    next(error);
  }
}
