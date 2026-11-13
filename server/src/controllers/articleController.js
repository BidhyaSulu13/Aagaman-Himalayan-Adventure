import { randomBytes } from "node:crypto";
import { Article } from "../models/Article.js";
import { Booking } from "../models/Booking.js";

const publicArticleQuery = {
  $or: [
    { status: "published" },
    { status: { $exists: false }, publicationStatus: "Published" },
    { status: "draft", publicationStatus: "Published" },
    { status: "approved", publicationStatus: "Published" },
  ],
};

const storyPhotoUrls = (files = []) => files.map((file) => `/api/uploads/stories/${file.filename}`);
const storyMediaFiles = (files = {}) => ({ photos: files.photos || [], videos: files.videoFile || [] });
const journalCategories = new Set([
  "Himalayan Culture & Life",
  "Behind the Adventure",
  "Nature & Exploration",
]);
const legacyJournalCategories = {
  "Trekker Stories": "Behind the Adventure",
  "Field Notes": "Nature & Exploration",
  "Gear & Packing": "Behind the Adventure",
  "Sherpa Heritage": "Himalayan Culture & Life",
  "Teahouse & Sherpa Culture": "Himalayan Culture & Life",
};

function normalizeJournalArticle(article) {
  const value = article.toObject ? article.toObject() : article;
  if (value.type === "story") value.category = "Trekker Stories";
  else if (legacyJournalCategories[value.category]) value.category = legacyJournalCategories[value.category];
  return value;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function validateStoryMedia(req, res) {
  const { photos, videos } = storyMediaFiles(req.files);
  if (photos.some((file) => file.size > 5 * 1024 * 1024)) {
    res.status(400).json({ success: false, message: "Each photograph must be 5 MB or smaller." });
    return null;
  }
  if (videos.some((file) => file.size > 50 * 1024 * 1024)) {
    res.status(400).json({ success: false, message: "Video files must be 50 MB or smaller." });
    return null;
  }

  const socialUrl = (field, hosts) => {
    const value = String(req.body[field] || "").trim();
    if (!value) return "";
    try {
      const parsed = new URL(value);
      if (!/^https?:$/.test(parsed.protocol) || !hosts.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))) return null;
      return parsed.toString();
    } catch {
      return null;
    }
  };
  const instagramUrl = socialUrl("instagramUrl", ["instagram.com"]);
  const facebookUrl = socialUrl("facebookUrl", ["facebook.com", "fb.watch"]);
  const videoUrl = socialUrl("videoUrl", ["youtube.com", "youtu.be", "vimeo.com"]);
  if (instagramUrl === null || facebookUrl === null || videoUrl === null) {
    res.status(400).json({ success: false, message: "Use valid Instagram, Facebook, or video links." });
    return null;
  }
  return { photos, videos, instagramUrl, facebookUrl, videoUrl };
}

// GET /api/articles
export async function getArticles(req, res, next) {
  try {
    const { category, search } = req.query;
    const clauses = [publicArticleQuery];

    if (category && category !== "All") {
      clauses.push({ category: { $regex: new RegExp(category, "i") } });
    }

    if (req.query.type && ["guide", "story"].includes(req.query.type)) {
      clauses.push({ type: req.query.type });
    }

    if (search && search.trim()) {
      const s = search.trim();
      clauses.push({ $or: [
        { title: { $regex: s, $options: "i" } },
        { summary: { $regex: s, $options: "i" } },
        { content: { $regex: s, $options: "i" } },
      ] });
    }

    const articles = await Article.find({ $and: clauses })
      .populate("relatedTrek", "title slug region")
      .sort({ isFeatured: -1, publicationDate: -1 });

    res.json({
      success: true,
      count: articles.length,
      articles: articles.map(normalizeJournalArticle),
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/articles/admin (Admin: include drafts and archived articles)
export async function getAdminArticles(_req, res, next) {
  try {
    const articles = await Article.find()
      .populate("relatedTrek", "title slug region")
      .populate("submittedBy", "name email avatar")
      .populate("completedBooking", "bookingReference createdAt trek")
      .sort({ updatedAt: -1 });
    res.json({ success: true, count: articles.length, articles: articles.map(normalizeJournalArticle) });
  } catch (error) {
    next(error);
  }
}

// GET /api/articles/mine (Traveler: own submitted stories)
export async function getMyStories(req, res, next) {
  try {
    const articles = await Article.find({ submittedBy: req.user._id, type: "story" })
      .populate("relatedTrek", "title slug")
      .populate("completedBooking", "bookingReference createdAt")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: articles.length, articles: articles.map(normalizeJournalArticle) });
  } catch (error) {
    next(error);
  }
}

// POST /api/articles/stories (Traveler: submit a completed-trek story)
export async function submitTrekStory(req, res, next) {
  try {
    const media = validateStoryMedia(req, res);
    if (!media) return;
    const title = String(req.body.title || "").trim();
    const content = String(req.body.content || "").trim();
    const bookingId = String(req.body.bookingId || "");
    if (!title || title.length > 200 || !content || content.length < 80 || content.length > 30000) {
      return res.status(400).json({ success: false, message: "Enter a title and a story between 80 and 30,000 characters." });
    }
    if (!media.photos.length) {
      return res.status(400).json({ success: false, message: "Add at least one photograph for your experience." });
    }

    const ownership = [{ user: req.user._id }];
    if (req.user.emailVerified) {
      ownership.push({ "travelerDetails.email": new RegExp(`^${escapeRegex(req.user.email)}$`, "i") });
    }
    const booking = await Booking.findOne({
      _id: bookingId,
      bookingStatus: "Completed",
      $or: ownership,
    }).populate("trek", "title slug");

    if (!booking?.trek) {
      return res.status(403).json({ success: false, message: "A completed trek booking in your account is required to submit a story." });
    }

    const duplicate = await Article.findOne({ type: "story", completedBooking: booking._id, blocksDuplicateSubmission: { $ne: false } }).select("_id title status");
    if (duplicate) {
      return res.status(409).json({ success: false, message: "An experience already exists for this completed booking. Revise that submission instead." });
    }

    const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 150) || "trekker-story";
    const slug = `${slugBase}-${randomBytes(3).toString("hex")}`;
    const summaryText = content.replace(/\s+/g, " ");
    const photos = storyPhotoUrls(media.photos);
    const article = await Article.create({
      title,
      slug,
      summary: summaryText.slice(0, 497) + (summaryText.length > 497 ? "..." : ""),
      content,
      coverImage: photos[0],
      photos,
      videoUrl: media.videos.length ? `/api/uploads/stories/${media.videos[0].filename}` : media.videoUrl,
      instagramUrl: media.instagramUrl,
      facebookUrl: media.facebookUrl,
      type: "story",
      status: "pending_review",
      publicationStatus: "Draft",
      category: "Trekker Stories",
      readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
      author: {
        name: req.user.name,
        role: "Verified Trekker",
        avatarUrl: req.user.avatar || "",
        isVerifiedTrekker: true,
      },
      relatedTrek: booking.trek._id,
      completedBooking: booking._id,
      submittedBy: req.user._id,
    });

    res.status(201).json({ success: true, article, message: "Your trek story was sent to the Agaaman team for review." });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "An experience already exists for this completed booking." });
    }
    next(error);
  }
}

// PATCH /api/articles/stories/:id (Traveler: revise a rejected experience)
export async function updateMyTrekStory(req, res, next) {
  try {
    const media = validateStoryMedia(req, res);
    if (!media) return;
    const article = await Article.findOne({ _id: req.params.id, type: "story", submittedBy: req.user._id });
    if (!article) return res.status(404).json({ success: false, message: "Your trek experience was not found." });
    if (article.status !== "rejected" && article.status !== "draft") {
      return res.status(409).json({ success: false, message: "Only a returned experience can be revised." });
    }

    const title = String(req.body.title || "").trim();
    const content = String(req.body.content || "").trim();
    if (!title || title.length > 200 || content.length < 80 || content.length > 30000) {
      return res.status(400).json({ success: false, message: "Enter a title and a story between 80 and 30,000 characters." });
    }

    const photos = media.photos.length ? storyPhotoUrls(media.photos) : article.photos?.length ? article.photos : [article.coverImage];
    article.title = title;
    article.content = content;
    article.summary = content.replace(/\s+/g, " ").slice(0, 497) + (content.length > 497 ? "..." : "");
    article.photos = photos;
    article.coverImage = photos[0];
    if (media.videos.length) article.videoUrl = `/api/uploads/stories/${media.videos[0].filename}`;
    else if (Object.hasOwn(req.body, "videoUrl")) article.videoUrl = media.videoUrl;
    if (Object.hasOwn(req.body, "instagramUrl")) article.instagramUrl = media.instagramUrl;
    if (Object.hasOwn(req.body, "facebookUrl")) article.facebookUrl = media.facebookUrl;
    article.readTime = `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`;
    article.status = "pending_review";
    article.publicationStatus = "Draft";
    article.moderationNote = "";
    await article.save();
    await article.populate(["relatedTrek", "completedBooking"]);
    res.json({ success: true, article, message: "Your revised experience was sent for review." });
  } catch (error) {
    next(error);
  }
}

// GET /api/articles/:slug
export async function getArticleBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({ slug, ...publicArticleQuery }).populate("relatedTrek", "title slug");

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    const related = await Article.find({
      _id: { $ne: article._id },
      ...publicArticleQuery,
    }).limit(3);

    res.json({
      success: true,
      article: normalizeJournalArticle(article),
      related: related.map(normalizeJournalArticle),
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/articles (Admin)
export async function createArticle(req, res, next) {
  try {
    const data = req.body;
    if (data.category && !journalCategories.has(data.category)) {
      return res.status(400).json({ success: false, message: "Choose a supported Journal category." });
    }
    data.category ||= "Behind the Adventure";
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    const status = data.status || (data.publicationStatus === "Published" ? "published" : data.publicationStatus === "Unpublished" || data.publicationStatus === "Archived" ? "unpublished" : "draft");
    const article = await Article.create({
      ...data,
      type: "guide",
      status,
      author: typeof data.author === "string"
        ? { name: data.author || req.user.name, role: "Agaaman Travel Guide", avatarUrl: req.user.avatar || "", isVerifiedTrekker: false }
        : data.author,
    });

    res.status(201).json({
      success: true,
      article,
      message: "Article published successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/articles/:id (Admin)
export async function updateArticle(req, res, next) {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    const currentArticle = await Article.findById(id).select("type");
    if (!currentArticle) return res.status(404).json({ success: false, message: "Article not found." });
    const allowedCategories = currentArticle.type === "story" ? new Set([...journalCategories, "Trekker Stories"]) : journalCategories;
    if (update.category && !allowedCategories.has(update.category)) {
      return res.status(400).json({ success: false, message: "Choose a supported Journal category." });
    }
    if (Object.hasOwn(update, "status")) {
      update.publicationStatus = update.status === "published" || update.status === "approved" ? "Published" : update.status === "unpublished" ? "Unpublished" : "Draft";
    } else if (Object.hasOwn(update, "publicationStatus")) {
      update.status = update.publicationStatus === "Published" ? "published" : update.publicationStatus === "Unpublished" || update.publicationStatus === "Archived" ? "unpublished" : "draft";
    }
    const article = await Article.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found." });
    }

    res.json({
      success: true,
      article,
      message: "Article updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/articles/:id/moderate-story (Admin)
export async function moderateTrekStory(req, res, next) {
  try {
    const { decision, note = "" } = req.body;
    if (!["approve", "reject", "request_corrections", "allow_another"].includes(decision)) {
      return res.status(400).json({ success: false, message: "Choose approve, reject, request corrections, or allow another submission." });
    }
    const article = await Article.findOne({ _id: req.params.id, type: "story" });
    if (!article) return res.status(404).json({ success: false, message: "Trek story not found." });

    if (decision === "allow_another") {
      article.blocksDuplicateSubmission = false;
      await article.save();
      await article.populate(["relatedTrek", "submittedBy", "completedBooking"]);
      return res.json({ success: true, article, message: "One additional experience is now allowed for this booking." });
    }

    article.status = decision === "approve" ? "published" : "rejected";
    article.publicationStatus = decision === "approve" ? "Published" : "Draft";
    article.category = "Trekker Stories";
    article.moderationNote = decision === "approve" ? "" : String(note).trim().slice(0, 1000);
    if (decision === "approve") article.publicationDate = new Date();
    await article.save();
    await article.populate(["relatedTrek", "submittedBy"]);
    res.json({ success: true, article, message: decision === "approve" ? "Trek experience approved and published." : decision === "request_corrections" ? "Correction request sent to the traveler." : "Trek experience rejected." });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/articles/:id (Admin)
export async function deleteArticle(req, res, next) {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found." });
    }

    res.json({
      success: true,
      message: "Article deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
