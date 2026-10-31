import { Page } from "../../components/common/Page.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { TrekCard } from "../../components/trek/TrekCard.jsx";
import { treks } from "../../data/index.js";
import { useFavorites } from "../../context/FavoritesContext.jsx";

export function SavedPage() {
  const { savedTreks } = useFavorites();
  const saved = treks.filter((trek) => savedTreks.includes(trek.slug));
  return (
    <Page className="saved-page">
      <section className="page-intro section-wrap">
        <p className="eyebrow">A little collection</p><h1>Trails on<br /><em>your mind.</em></h1>
        <p>Saved on this device for now. Your list will stay in this browser, but isn't connected to an account.</p>
      </section>
      <section className="section-wrap saved-content">
        {saved.length ? <div className="trek-grid">{saved.map((trek) => <TrekCard trek={trek} key={trek.slug} />)}</div> : <EmptyState title="Nothing saved just yet" copy="When a trek catches your eye, tap the heart and it will be waiting here." action="Explore the treks" to="/treks" />}
      </section>
    </Page>
  );
}
