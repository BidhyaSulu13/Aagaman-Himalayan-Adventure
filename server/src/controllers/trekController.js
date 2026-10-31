import { Trek } from "../models/Trek.js";
import { Departure } from "../models/Departure.js";
import { Review } from "../models/Review.js";

// GET /api/treks
export async function getTreks(req, res, next) {
  try {
    const {
      region,
      difficulty,
      search,
      featured,
      published,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // By default, public only sees published treks unless admin specifically queries
    if (published !== undefined) {
      query.published = published === "true";
    } else {
      query.published = true;
    }

    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    if (region && region !== "All") {
      query.region = { $regex: new RegExp(region, "i") };
    }

    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: "i" } },
        { region: { $regex: s, $options: "i" } },
        { location: { $regex: s, $options: "i" } },
        { shortDescription: { $regex: s, $options: "i" } },
      ];
    }

    let sortOption = { featured: -1, createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "duration_asc") sortOption = { duration: 1 };
    if (sort === "duration_desc") sortOption = { duration: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [treks, total] = await Promise.all([
      Trek.find(query)
        .populate("destination", "name slug region")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Trek.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: treks.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      treks,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/treks/:slug
export async function getTrekBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const trek = await Trek.findOne({ slug })
      .populate("destination", "name slug region description coordinates");

    if (!trek) {
      return res.status(404).json({
        success: false,
        message: `Trek with slug '${slug}' not found.`,
      });
    }

    // Fetch upcoming guaranteed or available departures
    const departures = await Departure.find({
      trek: trek._id,
      startDate: { $gte: new Date() },
      status: { $ne: "Cancelled" },
    }).sort({ startDate: 1 });

    // Fetch verified approved reviews
    const reviews = await Review.find({
      trek: trek._id,
      moderationStatus: "approved",
    })
      .populate("user", "name avatar nationality")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      trek,
      departures,
      reviews,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/treks (Admin)
export async function createTrek(req, res, next) {
  try {
    const trekData = req.body;

    if (!trekData.slug && trekData.title) {
      trekData.slug = trekData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const trek = await Trek.create(trekData);

    res.status(201).json({
      success: true,
      trek,
      message: "Trek package created successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/treks/:id (Admin)
export async function updateTrek(req, res, next) {
  try {
    const { id } = req.params;
    const trek = await Trek.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!trek) {
      return res.status(404).json({ success: false, message: "Trek not found." });
    }

    res.json({
      success: true,
      trek,
      message: "Trek updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/treks/:id (Admin)
export async function deleteTrek(req, res, next) {
  try {
    const { id } = req.params;
    const trek = await Trek.findByIdAndDelete(id);

    if (!trek) {
      return res.status(404).json({ success: false, message: "Trek not found." });
    }

    res.json({
      success: true,
      message: `Trek '${trek.title}' deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/treks/:id/publish (Admin)
export async function togglePublishTrek(req, res, next) {
  try {
    const { id } = req.params;
    const trek = await Trek.findById(id);
    if (!trek) {
      return res.status(404).json({ success: false, message: "Trek not found." });
    }

    trek.published = !trek.published;
    await trek.save();

    res.json({
      success: true,
      trek,
      message: `Trek is now ${trek.published ? "published" : "hidden/draft"}.`,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/treks/:id/featured (Admin)
export async function toggleFeaturedTrek(req, res, next) {
  try {
    const { id } = req.params;
    const trek = await Trek.findById(id);
    if (!trek) {
      return res.status(404).json({ success: false, message: "Trek not found." });
    }

    trek.featured = !trek.featured;
    await trek.save();

    res.json({
      success: true,
      trek,
      message: `Trek is now ${trek.featured ? "featured on homepage" : "unfeatured"}.`,
    });
  } catch (error) {
    next(error);
  }
}
