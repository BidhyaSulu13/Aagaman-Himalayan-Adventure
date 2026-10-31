import { Favorite } from "../models/Favorite.js";

// GET /api/favorites
export async function getFavorites(req, res, next) {
  try {
    let fav = await Favorite.findOne({ user: req.user._id }).populate({
      path: "treks",
      select: "title slug region duration price difficulty images rating",
    });

    if (!fav) {
      fav = await Favorite.create({ user: req.user._id, treks: [] });
    }

    res.json({
      success: true,
      treks: fav.treks,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/favorites/toggle
export async function toggleFavorite(req, res, next) {
  try {
    const { trekId } = req.body;
    if (!trekId) {
      return res.status(400).json({ success: false, message: "trekId is required." });
    }

    let fav = await Favorite.findOne({ user: req.user._id });
    if (!fav) {
      fav = await Favorite.create({ user: req.user._id, treks: [trekId] });
      return res.json({ success: true, saved: true, message: "Added to saved treks." });
    }

    const index = fav.treks.findIndex((id) => id.toString() === trekId.toString());
    let saved = false;

    if (index >= 0) {
      fav.treks.splice(index, 1);
      saved = false;
    } else {
      fav.treks.push(trekId);
      saved = true;
    }

    await fav.save();

    res.json({
      success: true,
      saved,
      message: saved ? "Added to saved treks." : "Removed from saved treks.",
    });
  } catch (error) {
    next(error);
  }
}
