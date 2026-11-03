import { Departure } from "../models/Departure.js";
import { Trek } from "../models/Trek.js";

// GET /api/departures
export async function getDepartures(req, res, next) {
  try {
    const { trekId, trekSlug, status, upcoming = "true" } = req.query;

    const query = {};

    if (trekId) query.trek = trekId;
    if (trekSlug) {
      const trek = await Trek.findOne({ slug: trekSlug });
      if (trek) query.trek = trek._id;
    }

    if (status) {
      query.status = status;
    } else if (upcoming === "true") {
      query.status = { $in: ["Available", "Guaranteed", "Filling Fast"] };
    }

    if (upcoming === "true") {
      query.startDate = { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
    }

    const departures = await Departure.find(query)
      .populate("trek", "title slug region price duration difficulty images")
      .sort({ startDate: 1 });

    res.json({
      success: true,
      count: departures.length,
      departures,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/departures (Admin)
export async function createDeparture(req, res, next) {
  try {
    const { trekId, trekSlug, startDate, endDate, capacity, price, originalPrice, status } = req.body;

    let targetTrekId = trekId;
    if (!targetTrekId && trekSlug) {
      const t = await Trek.findOne({ slug: trekSlug });
      if (!t) return res.status(404).json({ success: false, message: "Trek not found." });
      targetTrekId = t._id;
    }

    if (!targetTrekId || !startDate || !endDate || !capacity || !price) {
      return res.status(400).json({
        success: false,
        message: "Trek, start date, end date, capacity, and price are required.",
      });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime()) ||
      parsedEndDate < parsedStartDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Departure end date must be on or after a valid start date.",
      });
    }

    const departure = await Departure.create({
      trek: targetTrekId,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      capacity: Number(capacity),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      status: status || "Available",
    });

    const populated = await departure.populate("trek", "title slug region");

    res.status(201).json({
      success: true,
      departure: populated,
      message: "Departure added successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/departures/:id (Admin)
export async function updateDeparture(req, res, next) {
  try {
    const { id } = req.params;
    const { trekId, trekSlug, ...fields } = req.body;
    if (trekId || trekSlug) {
      let targetTrekId = trekId;
      if (!targetTrekId) {
        const trek = await Trek.findOne({ slug: trekSlug });
        if (!trek) {
          return res.status(404).json({ success: false, message: "Trek not found." });
        }
        targetTrekId = trek._id;
      }
      fields.trek = targetTrekId;
    }

    const departure = await Departure.findById(id);
    if (!departure) {
      return res.status(404).json({ success: false, message: "Departure not found." });
    }
    if (fields.capacity !== undefined && Number(fields.capacity) < departure.bookedCount) {
      return res.status(400).json({
        success: false,
        message: `Capacity cannot be lower than the ${departure.bookedCount} already-booked seat(s).`,
      });
    }
    if (
      fields.trek &&
      fields.trek.toString() !== departure.trek.toString() &&
      departure.bookedCount > 0
    ) {
      return res.status(409).json({
        success: false,
        message: "A departure with existing bookings cannot be reassigned to another trek.",
      });
    }
    const nextStartDate = fields.startDate ? new Date(fields.startDate) : departure.startDate;
    const nextEndDate = fields.endDate ? new Date(fields.endDate) : departure.endDate;
    if (
      Number.isNaN(nextStartDate.getTime()) ||
      Number.isNaN(nextEndDate.getTime()) ||
      nextEndDate < nextStartDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Departure end date must be on or after a valid start date.",
      });
    }

    Object.assign(departure, fields);
    await departure.save();
    await departure.populate("trek", "title slug");

    res.json({
      success: true,
      departure,
      message: "Departure updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/departures/:id (Admin)
export async function deleteDeparture(req, res, next) {
  try {
    const { id } = req.params;
    const departure = await Departure.findById(id);
    if (!departure) {
      return res.status(404).json({ success: false, message: "Departure not found." });
    }
    if (departure.bookedCount > 0) {
      return res.status(409).json({
        success: false,
        message: "This departure has active bookings. Close or cancel it instead of deleting it.",
      });
    }
    await departure.deleteOne();
    res.json({
      success: true,
      message: "Departure deleted.",
    });
  } catch (error) {
    next(error);
  }
}
