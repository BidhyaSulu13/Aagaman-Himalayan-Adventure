import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mountain } from "lucide-react";
import { api } from "../../services/api.js";
import { BookingPage } from "./BookingPage.jsx";
import "./BookAnotherTrekPage.css";

export function BookAnotherTrekPage() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    let active = true;
    api.treks.getAll({ limit: 100 })
      .then((response) => {
        if (!active) return;
        const items = response.success && Array.isArray(response.treks) ? response.treks : [];
        setTreks(items);
        const firstCategory = [...new Set(items.map((trek) => trek.region).filter(Boolean))].sort()[0] || "";
        setCategory(firstCategory);
        setSlug(items.find((trek) => trek.region === firstCategory)?.slug || items[0]?.slug || "");
      })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load treks."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => [...new Set(treks.map((trek) => trek.region).filter(Boolean))].sort(), [treks]);
  const categoryTreks = useMemo(() => treks.filter((trek) => trek.region === category), [treks, category]);
  const selectedTrek = treks.find((trek) => trek.slug === slug);

  const changeCategory = (value) => {
    setCategory(value);
    setSlug(treks.find((trek) => trek.region === value)?.slug || "");
  };

  return (
    <main className="book-another-page">
      <div className="book-another-heading">
        <Link to="/dashboard" className="book-another-back"><ArrowLeft size={17} /> My bookings</Link>
        <span className="book-another-eyebrow">PLAN YOUR NEXT ADVENTURE</span>
        <h1>Book another trek</h1>
        <p>Choose a region and trek. Your booking form updates here, so you can reserve another route without starting over.</p>
      </div>

      <div className="book-another-layout">
        <aside className="book-another-picker">
          <h2><Mountain size={19} /> Find your trek</h2>
          {loading ? <p role="status">Loading trek catalog…</p> : error ? <p role="alert">{error}</p> : treks.length === 0 ? <p>No treks are currently available.</p> : <>
            <label>Category / region
              <select value={category} onChange={(event) => changeCategory(event.target.value)}>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>Select a trek
              <select value={slug} onChange={(event) => setSlug(event.target.value)}>
                {categoryTreks.map((trek) => <option key={trek.slug} value={trek.slug}>{trek.title}</option>)}
              </select>
            </label>
            {selectedTrek && <div className="book-another-summary">
              <img src={selectedTrek.images?.[0] || selectedTrek.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80"} alt={selectedTrek.title} />
              <strong>{selectedTrek.title}</strong>
              <span>{selectedTrek.region} · {selectedTrek.duration} days · {selectedTrek.difficulty}</span>
              <b>From ${Number(selectedTrek.price || 0).toLocaleString()} USD / person</b>
            </div>}
          </>}
        </aside>

        <section className="book-another-form" aria-label="Selected trek booking form">
          {selectedTrek ? <BookingPage key={selectedTrek.slug} trekSlug={selectedTrek.slug} /> : !loading && !error ? <div className="book-another-empty">Choose a trek to see its booking form.</div> : null}
        </section>
      </div>
    </main>
  );
}

export default BookAnotherTrekPage;
