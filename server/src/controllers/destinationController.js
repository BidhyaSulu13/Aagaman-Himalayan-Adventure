import { Destination } from "../models/Destination.js";
import { Trek } from "../models/Trek.js";

// GET /api/destinations
export async function getDestinations(_req, res, next) {
  try {
    const destinations = await Destination.find().sort({ name: 1 });
    res.json({
      success: true,
      count: destinations.length,
      destinations,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/destinations/:slug
export async function getDestinationBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const destination = await Destination.findOne({ slug });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found.",
      });
    }

    const treks = await Trek.find({
      $or: [
        { destination: destination._id },
        { region: { $regex: destination.name, $options: "i" } },
      ],
      published: true,
    });

    res.json({
      success: true,
      destination,
      treks,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/destinations (Admin)
export async function createDestination(req, res, next) {
  try {
    const data = req.body;
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    const destination = await Destination.create(data);
    res.status(201).json({
      success: true,
      destination,
      message: "Destination created successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/destinations/:id (Admin)
export async function updateDestination(req, res, next) {
  try {
    const { id } = req.params;
    const destination = await Destination.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found." });
    }
    res.json({
      success: true,
      destination,
      message: "Destination updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/destinations/:id (Admin)
export async function deleteDestination(req, res, next) {
  try {
    const { id } = req.params;
    const destination = await Destination.findByIdAndDelete(id);
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found." });
    }
    res.json({
      success: true,
      message: "Destination deleted.",
    });
  } catch (error) {
    next(error);
  }
}
