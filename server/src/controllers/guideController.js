import { Guide } from "../models/Guide.js";

export async function getGuides(_req, res, next) {
  try {
    const guides = await Guide.find({ published: true }).sort({ category: 1, updatedAt: -1 });
    res.json({ success: true, count: guides.length, guides });
  } catch (error) { next(error); }
}

export async function getAdminGuides(_req, res, next) {
  try {
    const guides = await Guide.find().sort({ updatedAt: -1 });
    res.json({ success: true, count: guides.length, guides });
  } catch (error) { next(error); }
}

export async function createGuide(req, res, next) {
  try {
    const guide = await Guide.create(req.body);
    res.status(201).json({ success: true, guide, message: "Guide published successfully." });
  } catch (error) { next(error); }
}

export async function updateGuide(req, res, next) {
  try {
    const guide = await Guide.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!guide) return res.status(404).json({ success: false, message: "Guide not found." });
    res.json({ success: true, guide, message: "Guide updated successfully." });
  } catch (error) { next(error); }
}

export async function deleteGuide(req, res, next) {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);
    if (!guide) return res.status(404).json({ success: false, message: "Guide not found." });
    res.json({ success: true, message: "Guide deleted successfully." });
  } catch (error) { next(error); }
}
