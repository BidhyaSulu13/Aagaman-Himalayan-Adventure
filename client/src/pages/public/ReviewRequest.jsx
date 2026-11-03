import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { api } from "../../services/api.js";

export function ReviewRequestPage() {
  const [form, setForm] = useState({ bookingReference: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submitRequest = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const response = await api.reviews.requestVerification(form);
      setMessage(response.message);
    } catch (requestError) {
      setError(requestError.message || "We couldn't process your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page className="review-verification-page">
      <section className="review-verification-card">
        <p className="eyebrow"><ShieldCheck size={15} /> Verified trek review</p>
        <h1>Review a completed trek</h1>
        <p>
          No traveler account or dashboard is needed. Once the admin marks your
          booking Completed, request a one-time review link using the booking
          reference and email address from your reservation.
        </p>
        <form className="public-review-form" onSubmit={submitRequest}>
          <label>
            Booking reference
            <input
              value={form.bookingReference}
              onChange={(event) => setForm({ ...form, bookingReference: event.target.value })}
              autoComplete="off"
              required
            />
          </label>
          <label>
            Booking email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              autoComplete="email"
              required
            />
          </label>
          {error && <p className="public-form-error" role="alert">{error}</p>}
          {message && <p className="public-form-success" role="status">{message}</p>}
          <button className="button button-orange" type="submit" disabled={submitting}>
            {submitting ? "Requesting link…" : "Email me a review link"}
          </button>
        </form>
        <Link to="/treks" className="text-link">Explore treks</Link>
      </section>
    </Page>
  );
}

export default ReviewRequestPage;
