import { Region } from "../models/Region.js";
import { Trek } from "../models/Trek.js";
import { Destination } from "../models/Destination.js";

// GET /api/regions
export async function getRegions(_req, res, next) {
  try {
    const regions = await Region.find().sort({ name: 1 });
    res.json({
      success: true,
      count: regions.length,
      regions,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/regions/:slug
export async function getRegionBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const region = await Region.findOne({ slug });

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Region not found.",
      });
    }

    const treks = await Trek.find({
      region: { $regex: region.name, $options: "i" },
      published: true,
    });

    const destinations = await Destination.find({
      region: { $regex: region.name, $options: "i" },
    });

    res.json({
      success: true,
      region,
      treks,
      destinations,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/regions (Admin)
export async function createRegion(req, res, next) {
  try {
    const data = req.body;
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    const region = await Region.create(data);
    res.status(201).json({
      success: true,
      region,
      message: "Region created successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/regions/:id (Admin)
export async function updateRegion(req, res, next) {
  try {
    const { id } = req.params;
    const region = await Region.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!region) {
      return res.status(404).json({ success: false, message: "Region not found." });
    }
    res.json({
      success: true,
      region,
      message: "Region updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/regions/:id (Admin)
export async function deleteRegion(req, res, next) {
  try {
    const { id } = req.params;
    const region = await Region.findByIdAndDelete(id);
    if (!region) {
      return res.status(404).json({ success: false, message: "Region not found." });
    }
    res.json({
      success: true,
      message: "Region deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
