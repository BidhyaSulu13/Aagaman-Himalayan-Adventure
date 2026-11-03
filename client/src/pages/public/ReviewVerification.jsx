import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShieldCheck, Star } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { api } from "../../services/api.js";

export function ReviewVerificationPage() {
  const { token } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: "", comment: "", photos: [] });

  useEffect(() => {
    let active = true;
    api.reviews.getVerification(token)
      .then((response) => {
        if (active) setRequest(response.reviewRequest);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "This review link is invalid or expired.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [token]);

  const submitReview = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const body = new FormData();
      body.append("token", token);
      body.append("rating", String(form.rating));
      body.append("title", form.title);
      body.append("comment", form.comment);
      form.photos.forEach((photo) => body.append("photos", photo));
      const response = await api.reviews.createVerified(body);
      setMessage(response.message);
    } catch (requestError) {
      setError(requestError.message || "Your verified review could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page className="review-verification-page">
      <section className="review-verification-card">
        <p className="eyebrow"><ShieldCheck size={15} /> Verified trek review</p>
        {loading ? (
          <p role="status">Checking your secure review link…</p>
        ) : error && !request ? (
          <>
            <h1>Review link unavailable</h1>
            <p className="public-form-error" role="alert">{error}</p>
            <Link to="/treks" className="text-link">Explore treks</Link>
          </>
        ) : message ? (
          <>
            <h1>Thank you, {request?.name || "traveler"}.</h1>
            <p className="public-form-success" role="status">{message}</p>
            <Link to={`/treks/${request?.trek?.slug || ""}`} className="text-link">Return to your trek</Link>
          </>
        ) : request && (
          <>
            <h1>How was your {request.trek?.title} trek?</h1>
            <p>This one-time link verifies booking <strong>{request.bookingReference}</strong>. Your review will be marked Verified Trekker and held for admin approval.</p>
            <form className="public-review-form" onSubmit={submitReview}>
              <fieldset>
                <legend>Your rating</legend>
                <div className="review-star-picker" role="group" aria-label="Choose a star rating">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button key={rating} type="button" aria-label={`${rating} stars`} aria-pressed={form.rating === rating} onClick={() => setForm({ ...form, rating })}>
                      <Star size={24} fill={rating <= form.rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </fieldset>
              <label>Review title
                <input value={form.title} maxLength={120} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
              </label>
              <label>Your feedback
                <textarea value={form.comment} maxLength={2000} onChange={(event) => setForm({ ...form, comment: event.target.value })} required />
              </label>
              <label>Photos (optional, up to 4)
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => {
                  const files = Array.from(event.target.files || []);
                  if (files.length > 4 || files.some((file) => file.size > 5 * 1024 * 1024)) {
                    setError("Choose up to 4 photos, each no larger than 5 MB.");
                    event.target.value = "";
                    setForm({ ...form, photos: [] });
                    return;
                  }
                  setError("");
                  setForm({ ...form, photos: files });
                }} />
              </label>
              {error && <p className="public-form-error" role="alert">{error}</p>}
              <button className="button button-orange" type="submit" disabled={submitting}>
                {submitting ? "Submitting review…" : "Submit verified review"}
              </button>
            </form>
          </>
        )}
      </section>
    </Page>
  );
}

export default ReviewVerificationPage;
