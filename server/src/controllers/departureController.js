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

    if (status) query.status = status;

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

    const departure = await Departure.create({
      trek: targetTrekId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
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
    const departure = await Departure.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("trek", "title slug");

    if (!departure) {
      return res.status(404).json({ success: false, message: "Departure not found." });
    }

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
    const departure = await Departure.findByIdAndDelete(id);
    if (!departure) {
      return res.status(404).json({ success: false, message: "Departure not found." });
    }
    res.json({
      success: true,
      message: "Departure deleted.",
    });
  } catch (error) {
    next(error);
  }
}
