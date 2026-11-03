import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Page } from "../../components/common/Page.jsx";
import { Image } from "../../components/common/PagePrimitives.jsx";
import { api } from "../../services/api.js";

export function JournalPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <Page className="journal-page">
      <section className="page-intro section-wrap">
        <p className="eyebrow">The field journal</p>
        <h1>Stories for<br /><em>the way there.</em></h1>
        <p>Practical notes, mountain-minded ideas and small observations from the trail.</p>
      </section>
      <section className="section-wrap journal-list">
        {loading && <p role="status">Loading journal articles…</p>}
        {!loading && error && <p role="alert">{error}</p>}
        {!loading && !error && articles.length === 0 && <p>No journal articles have been published yet.</p>}
        {articles.map((article, index) => (
          <article className="journal-list-item" key={article.slug}>
            <Link className="journal-list-image" to={`/journal/${article.slug}`}>
              <Image src={article.coverImage || article.image} alt={article.title} />
            </Link>
            <div className="journal-list-copy">
              <p className="eyebrow">{article.category} <span>·</span> {article.readTime || article.read}</p>
              <h2><Link to={`/journal/${article.slug}`}>{article.title}</Link></h2>
              <p>{article.summary}</p>
              <Link className="text-link" to={`/journal/${article.slug}`}>Read the story</Link>
            </div>
            <span className="journal-list-number">0{index + 1}</span>
          </article>
        ))}
      </section>
    </Page>
  );
}
