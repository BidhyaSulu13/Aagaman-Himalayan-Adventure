import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3, Search } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { Image } from "../../components/common/PagePrimitives.jsx";
import { api } from "../../services/api.js";

export function JournalPage() {
  const categoryDescriptions = {
    "Trekker Stories": "First-hand journeys shared by travelers after completing an Agaaman trek. Every story is reviewed before it appears here.",
    "Himalayan Culture & Life": "People, traditions, food, and everyday life encountered across Nepal’s mountain communities.",
    "Behind the Adventure": "The preparation, local expertise, and small decisions that make a thoughtful expedition possible.",
    "Nature & Exploration": "Field notes on Nepal’s forests, rivers, wildlife, and changing mountain landscapes.",
  };
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    api.articles.getAll()
      .then((response) => {
        if (active) setArticles(response.articles || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load journal articles.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const journalCategories = new Set(articles.map((article) => article.category).filter(Boolean));
  const matchingArticles = articles.filter((article) => {
    if (activeCategory !== "all" && article.category !== activeCategory) return false;
    const searchText = `${article.title} ${article.summary} ${article.category}`.toLowerCase();
    return searchText.includes(query.trim().toLowerCase());
  });
  const featuredArticle = activeCategory === "all"
    ? matchingArticles.find((article) => article.isFeatured) || matchingArticles[0]
    : null;
  const selectedCategoryDescription = categoryDescriptions[activeCategory];
  const filteredArticles = activeCategory === "all"
    ? matchingArticles.filter((article) => article.slug !== featuredArticle?.slug)
    : matchingArticles;

  return (
    <Page className="journal-page">
      <section className={`journal-hero section-wrap${featuredArticle || selectedCategoryDescription ? "" : " is-unfeatured"}`}>
        <div className="journal-hero-copy">
          <p className="eyebrow">THE FIELD JOURNAL</p>
          <h1>Stories for<br /><em>the way there.</em></h1>
          <p>Practical notes, mountain-minded ideas and small observations from the trail.</p>
          <div className="journal-hero-stats">
            <span><strong>{articles.length}</strong> field stories</span>
            <span><strong>{journalCategories.size}</strong> journal topics</span>
          </div>
        </div>
        {featuredArticle && (
          <Link className="journal-featured" to={`/journal/${featuredArticle.slug}`}>
            <Image src={featuredArticle.coverImage || featuredArticle.image} alt={featuredArticle.title} />
            <span className="journal-featured-shade" />
            <span className="journal-featured-label">{featuredArticle.type === "story" ? "TREKKER STORY" : "EDITOR'S PICK"}</span>
            <span className="journal-featured-copy">
              <span className="eyebrow">{featuredArticle.category} | {featuredArticle.readTime || featuredArticle.read}</span>
              <strong>{featuredArticle.title}</strong>
              <span className="journal-featured-author">
                <span>{typeof featuredArticle.author === "string" ? featuredArticle.author : featuredArticle.author?.name || "Agaaman Editorial"}</span>
                {typeof featuredArticle.author === "object" && featuredArticle.author?.role && <small>{featuredArticle.author.role}</small>}
                {featuredArticle.type === "story" && featuredArticle.author?.isVerifiedTrekker && <span className="journal-featured-verified"><CheckCircle2 size={13} /> Verified Trekker</span>}
              </span>
              <span className="journal-featured-link">Read the featured story <ArrowRight size={16} /></span>
            </span>
          </Link>
        )}
        {!featuredArticle && selectedCategoryDescription && (
          <aside className="journal-category-feature">
            <p className="journal-category-feature-label">THE COLLECTION</p>
            <h2>{activeCategory}</h2>
            <p className="journal-category-feature-description">{selectedCategoryDescription}</p>
            <div className="journal-category-feature-bottom">
              <span><strong>{matchingArticles.length}</strong> published {matchingArticles.length === 1 ? "story" : "stories"}</span>
              <a href="#journal-posts">Browse this collection <ArrowRight size={16} /></a>
            </div>
          </aside>
        )}
      </section>

      <section className="section-wrap journal-discover">
        <div className="journal-discover-heading">
          <div><p className="eyebrow">FIND YOUR NEXT READ</p><h2>Notes from the trail</h2></div>
          <label className="journal-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories or topics" aria-label="Search journal stories" /></label>
        </div>
        <div className="journal-category-row" aria-label="Filter journal posts">
          {[
            { key: "all", label: "All Posts" },
            { key: "Trekker Stories", label: "Trekker Stories" },
            { key: "Himalayan Culture & Life", label: "Himalayan Culture & Life" },
            { key: "Behind the Adventure", label: "Behind the Adventure" },
            { key: "Nature & Exploration", label: "Nature & Exploration" },
          ].map(({ key, label }) => <button className={activeCategory === key ? "is-active" : ""} type="button" onClick={() => setActiveCategory(key)} key={key}>{label}</button>)}
        </div>
      </section>

      <section className="section-wrap journal-list" id="journal-posts">
        {loading && <p role="status">Loading journal articles...</p>}
        {!loading && error && <p role="alert">{error}</p>}
        {!loading && !error && articles.length === 0 && <p>No journal articles have been published yet.</p>}
        {!loading && !error && articles.length > 0 && filteredArticles.length === 0 && <p className="journal-empty">No stories match that search. Try a different topic.</p>}
        {filteredArticles.map((article, index) => (
          <article className="journal-list-item" key={article.slug}>
            <Link className="journal-list-image" to={`/journal/${article.slug}`}>
              <Image src={article.coverImage || article.image} alt={article.title} />
            </Link>
            <div className="journal-list-copy">
              <p className="eyebrow">{article.category} | {article.readTime || article.read}</p>
              <h2><Link to={`/journal/${article.slug}`}>{article.title}</Link></h2>
              <p>{article.summary}</p>
              <div className="journal-author-line">
                {article.author?.avatarUrl ? <img src={article.author.avatarUrl} alt="" /> : <span className="journal-author-avatar">{(article.author?.name || (typeof article.author === "string" ? article.author : "A")).slice(0, 1).toUpperCase()}</span>}
                <span className="journal-author-identity">
                  <span>{typeof article.author === "string" ? article.author : article.author?.name || "Agaaman Editorial"}</span>
                  {typeof article.author === "object" && article.author?.role && <small>{article.author.role}</small>}
                </span>
                {article.type === "story" && article.author?.isVerifiedTrekker && <span className="journal-verified-badge"><CheckCircle2 size={13} /> Verified Trekker</span>}
              </div>
              <Link className="text-link" to={`/journal/${article.slug}`}>Read the story <ArrowRight size={14} /></Link>
            </div>
            <span className="journal-list-number">{String(index + 1).padStart(2, "0")}<small><Clock3 size={12} /> {article.readTime || article.read || "Field note"}</small></span>
          </article>
        ))}
      </section>
    </Page>
  );
}
