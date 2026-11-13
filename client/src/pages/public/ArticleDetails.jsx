import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Backpack, Check, Clock3, Compass, Mountain, ShieldCheck } from "lucide-react";
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
  const articleReadTime = article.readTime || article.read || "6 min read";

  return (
    <Page className="article-page">
      <div className="article-wrap">
        <aside className="article-rail article-rail-left" aria-label="Article navigation">
          <div className="article-rail-card article-index-card">
            <span className="article-rail-icon"><Compass size={18} /></span>
            <p className="eyebrow">FIELD NOTES</p>
            <h2>In this guide</h2>
            <a href="#article-start">Start reading <ArrowUpRight size={14} /></a>
            {contentParagraphs.slice(0, 3).map((paragraph, index) => (
              <a href={`#article-paragraph-${index}`} key={index}>0{index + 1}<span>{paragraph.slice(0, 42)}{paragraph.length > 42 ? "…" : ""}</span></a>
            ))}
          </div>
          <div className="article-rail-note">
            <Mountain size={17} />
            <span>Made for the trail</span>
            <small>Practical advice for changing mountain conditions.</small>
          </div>
        </aside>

        <article className="article-content" id="article-start">
          <Link className="text-link" to="/journal"><ArrowLeft size={15} /> Back to the journal</Link>
          <p className="eyebrow">{article.category} <span>·</span> {articleReadTime}</p>
          <h1>{article.title}</h1>
          <p className="article-lede">{article.summary}</p>
          <div className="article-meta-line"><span><Clock3 size={15} /> {articleReadTime}</span><span>{article.category}</span></div>
          <div className="article-image"><Image src={article.coverImage || article.image} alt={article.title} /></div>
          {article.type === "story" && article.videoUrl?.startsWith("/api/uploads/stories/") && <video className="article-story-video" controls preload="metadata" src={article.videoUrl} />}
          {article.type === "story" && article.videoUrl?.startsWith("http") && <div className="article-story-links"><a href={article.videoUrl} target="_blank" rel="noreferrer">Watch the attached video</a></div>}
          {article.type === "story" && (article.instagramUrl || article.facebookUrl) && (
            <div className="article-story-links">
              {article.instagramUrl && <a href={article.instagramUrl} target="_blank" rel="noreferrer">View Instagram post</a>}
              {article.facebookUrl && <a href={article.facebookUrl} target="_blank" rel="noreferrer">View Facebook post</a>}
            </div>
          )}
          <div className="article-body">
            {contentParagraphs.map((paragraph, index) => <p id={`article-paragraph-${index}`} key={index}>{paragraph}</p>)}
          </div>
          {article.type === "story" && article.photos?.length > 1 && (
            <div className="article-story-gallery" aria-label="Trek experience photographs">
              {article.photos.slice(1).map((photo, index) => <a href={photo} target="_blank" rel="noreferrer" key={`${photo}-${index}`}><Image src={photo} alt={`${article.title} photograph ${index + 2}`} /></a>)}
            </div>
          )}
        </article>

        <aside className="article-rail article-rail-right" aria-label="Trek planning resources">
          <div className="article-rail-card article-check-card">
            <span className="article-rail-icon"><Backpack size={18} /></span>
            <p className="eyebrow">TRAIL READY</p>
            <h2>A little preparation goes a long way.</h2>
            <ul><li><Check size={15} /> Check the season and route</li><li><Check size={15} /> Pack for layered conditions</li><li><Check size={15} /> Leave room for the essentials</li></ul>
          </div>
          <div className="article-rail-card article-resource-card">
            <ShieldCheck size={19} />
            <p className="eyebrow">PLAN WITH CONFIDENCE</p>
            <p>Explore route details and practical guidance before choosing your trek.</p>
            <Link to="/trekking-guide">Trekking guide <ArrowUpRight size={14} /></Link>
            <Link to="/treks">Explore treks <ArrowUpRight size={14} /></Link>
          </div>
        </aside>
      </div>
    </Page>
  );
}
