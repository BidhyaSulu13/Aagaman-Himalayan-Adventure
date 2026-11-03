import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { Image } from "../../components/common/PagePrimitives.jsx";
import { api } from "../../services/api.js";
import { NotFoundPage } from "./MiscPages.jsx";

export function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setArticle(null);
    setNotFound(false);
    setLoadError("");
    api.articles.getBySlug(slug)
      .then((response) => {
        if (active) setArticle(response.article || null);
      })
      .catch((error) => {
        if (!active) return;
        if (error.message.toLowerCase().includes("not found")) setNotFound(true);
        else setLoadError(error.message || "Unable to load this article.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [slug]);

  if (loading) return <Page className="article-page"><div className="article-wrap">Loading article…</div></Page>;
  if (notFound) return <NotFoundPage />;
  if (loadError) return <Page className="article-page"><div className="article-wrap" role="alert">{loadError}</div></Page>;
  if (!article) return <NotFoundPage />;
  const contentParagraphs = (article.content || "").split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean);

  return (
    <Page className="article-page">
      <article className="article-wrap">
        <Link className="text-link" to="/journal"><ArrowLeft size={15} /> Back to the journal</Link>
        <p className="eyebrow">{article.category} · {article.readTime || article.read}</p>
        <h1>{article.title}</h1>
        <p className="article-lede">{article.summary}</p>
        <div className="article-image"><Image src={article.coverImage || article.image} alt={article.title} /></div>
        <div className="article-body">
          {contentParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </article>
    </Page>
  );
}
