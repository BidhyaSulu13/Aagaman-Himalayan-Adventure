import { Link } from "react-router-dom";
import { Page } from "../../components/common/Page.jsx";
import { DemoBanner, Image } from "../../components/common/PagePrimitives.jsx";
import { articles } from "../../data/index.js";

export function JournalPage() {
  return (
    <Page className="journal-page">
      <DemoBanner />
      <section className="page-intro section-wrap">
        <p className="eyebrow">The field journal</p>
        <h1>Stories for<br /><em>the way there.</em></h1>
        <p>Practical notes, mountain-minded ideas and small observations from the trail. Articles here are original project demonstrations.</p>
      </section>
      <section className="section-wrap journal-list">
        {articles.map((article, index) => (
          <article className="journal-list-item" key={article.slug}>
            <Link className="journal-list-image" to={`/journal/${article.slug}`}>
              <Image src={article.image} alt={article.title} />
            </Link>
            <div className="journal-list-copy">
              <p className="eyebrow">{article.category} <span>·</span> {article.read}</p>
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
