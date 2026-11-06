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
        { slug: { $in: destination.trekSlugs || [] } },
        { _id: { $in: destination.relatedTreks || [] } },
      ],
      published: true,
      isArchived: { $ne: true },
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
    const result = await resolveDestinationTreks(data, true);
    if (result.error) return res.status(400).json({ success: false, message: result.error });
    const destinationData = result.data;
    const destination = await Destination.create(destinationData);
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
    const result = await resolveDestinationTreks(req.body);
    if (result.error) return res.status(400).json({ success: false, message: result.error });
    const update = result.data;
    const destination = await Destination.findByIdAndUpdate(id, update, {
      returnDocument: "after",
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

async function resolveDestinationTreks(data, required = false) {
  if (!Array.isArray(data.trekSlugs)) {
    return required
      ? { error: "Every destination must link to between 1 and 3 published treks." }
      : { data };
  }

  const slugs = [...new Set(data.trekSlugs.filter((slug) => typeof slug === "string").map((slug) => slug.trim()).filter(Boolean))];
  if (slugs.length < 1 || slugs.length > 3) {
    return { error: "Every destination must link to between 1 and 3 published treks." };
  }

  const treks = await Trek.find({
    slug: { $in: slugs },
    published: true,
    isArchived: { $ne: true },
  }).select("_id slug");
  if (treks.length !== slugs.length) {
    return { error: "Select 1 to 3 existing, published treks for this destination." };
  }

  return {
    data: {
      ...data,
      trekSlugs: slugs,
      relatedTreks: treks.map((trek) => trek._id),
    },
  };
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
