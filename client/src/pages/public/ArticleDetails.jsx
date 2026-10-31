import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { DemoBanner, Image } from "../../components/common/PagePrimitives.jsx";
import { articles } from "../../data/index.js";
import { NotFoundPage } from "./MiscPages.jsx";

export function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);
  if (!article) return <NotFoundPage />;
  return (
    <Page className="article-page">
      <DemoBanner />
      <article className="article-wrap">
        <Link className="text-link" to="/journal"><ArrowLeft size={15} /> Back to the journal</Link>
        <p className="eyebrow">{article.category} · {article.read}</p>
        <h1>{article.title}</h1>
        <p className="article-lede">{article.summary}</p>
        <div className="article-image"><Image src={article.image} alt="" /></div>
        <div className="article-body">
          <p className="article-dropcap">The best journeys rarely begin with knowing every answer. A little preparation gives you confidence, but leaving room to learn as you go is part of what makes a mountain walk memorable.</p>
          <h2>Begin with a pace you can keep</h2>
          <p>On a high trail, an unhurried rhythm matters more than a fast first morning. Build in time to pause, drink water, and notice how you feel. Local guides can help you understand changing conditions and make thoughtful choices along the way.</p>
          <h2>Leave space in the plan</h2>
          <p>Weather, trail conditions, and community needs can shift. Treat an itinerary as a conversation rather than a promise, and check current information with qualified local operators before setting out.</p>
          <p className="article-disclaimer">This is demonstration editorial content for a university project, not medical or route-safety advice.</p>
        </div>
      </article>
    </Page>
  );
}
