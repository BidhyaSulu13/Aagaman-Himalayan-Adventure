import { Article } from "../models/Article.js";

// GET /api/articles
export async function getArticles(req, res, next) {
  try {
    const { category, search, status } = req.query;
    const query = {};

    if (status) {
      query.publicationStatus = status;
    } else {
      query.publicationStatus = "Published";
    }

    if (category && category !== "All") {
      query.category = { $regex: new RegExp(category, "i") };
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: "i" } },
        { summary: { $regex: s, $options: "i" } },
        { content: { $regex: s, $options: "i" } },
      ];
    }

    const articles = await Article.find(query).sort({ publicationDate: -1 });

    res.json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/articles/:slug
export async function getArticleBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({ slug });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    const related = await Article.find({
      _id: { $ne: article._id },
      publicationStatus: "Published",
    }).limit(3);

    res.json({
      success: true,
      article,
      related,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/articles (Admin)
export async function createArticle(req, res, next) {
  try {
    const data = req.body;
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    const article = await Article.create(data);

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
    const article = await Article.findByIdAndUpdate(id, req.body, {
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
