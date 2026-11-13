import "dotenv/config";
import mongoose from "mongoose";

const CATEGORY_MIGRATIONS = {
  "Trekker Stories": "Behind the Adventure",
  "Field Notes": "Nature & Exploration",
  "Gear & Packing": "Behind the Adventure",
  "Sherpa Heritage": "Himalayan Culture & Life",
  "Teahouse & Sherpa Culture": "Himalayan Culture & Life",
};
const apply = process.argv.includes("--apply");

async function migrateJournalCategories() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/himalayan_adventure");
  try {
    const Article = mongoose.model("Article", new mongoose.Schema({ category: String, type: String, status: String, publicationStatus: String }, { strict: false, collection: "articles" }));
    const results = [];
    for (const [from, to] of Object.entries(CATEGORY_MIGRATIONS)) {
      const filter = { category: from, type: { $ne: "story" } };
      const count = await Article.countDocuments(filter);
      results.push({ from, to, count });
      if (apply && count) await Article.updateMany(filter, { $set: { category: to } });
    }
    const legacyPublished = await Article.countDocuments({ type: { $ne: "story" }, status: "draft", publicationStatus: "Published" });
    if (apply && legacyPublished) {
      await Article.updateMany(
        { type: { $ne: "story" }, status: "draft", publicationStatus: "Published" },
        { $set: { status: "published" } }
      );
    }
    console.table(results);
    console.log(`${apply ? "Updated" : "Would update"} legacy published records: ${legacyPublished}`);
    console.log(apply ? "Journal migration applied." : "Dry run only. Add --apply to update MongoDB.");
  } finally {
    await mongoose.disconnect();
  }
}

migrateJournalCategories().catch((error) => {
  console.error("Journal migration failed:", error.message);
  process.exitCode = 1;
});
