import { Page } from "../../components/common/Page.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { TrekCard } from "../../components/trek/TrekCard.jsx";
import { useFavorites } from "../../context/FavoritesContext.jsx";

export function SavedPage() {
  const { savedTreks, loading, error } = useFavorites();
  return (
    <Page className="saved-page">
      <section className="page-intro section-wrap">
        <p className="eyebrow">A little collection</p><h1>Trails on<br /><em>your mind.</em></h1>
        <p>Your saved treks are private to your account and available whenever you sign in.</p>
      </section>
      <section className="section-wrap saved-content">
        {loading ? (
          <p role="status">Loading your saved treks…</p>
        ) : error ? (
          <div className="dashboard-load-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>Reload saved treks</button>
          </div>
        ) : savedTreks.length ? (
          <div className="trek-grid">
            {savedTreks.map((trek) => <TrekCard trek={trek} key={trek._id || trek.slug} />)}
          </div>
        ) : (
          <EmptyState
            title="Your favourites list is empty"
            copy="Save a trek you love and it will be waiting here when you return."
            action="Visit Nepal Treks"
            to="/treks"
          />
        )}
      </section>
    </Page>
  );
}
