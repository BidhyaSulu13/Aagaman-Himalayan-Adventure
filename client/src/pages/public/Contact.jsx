import { useState } from "react";
import { ArrowRight, Check, Clock3, MapPin, Send } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { api } from "../../services/api.js";

const initialForm = { name: "", email: "", phone: "", topic: "", message: "" };

export function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.contactMessages.create(form);
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message || "We couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page className="contact-page">
      <section className="contact-layout section-wrap">
        <div className="contact-intro">
          <p className="eyebrow">Talk with a local team</p>
          <h1>Tell us what<br /><em>you’re dreaming of.</em></h1>
          <p>Ask a question, share an idea, or tell us how you like to travel. Your note goes straight to our team in Kathmandu.</p>
          <div className="contact-side-note"><MapPin size={17} /><span>Thamel, Kathmandu, Nepal<br /><small>Local trip planning and trail support</small></span></div>
          <div className="contact-side-note"><Clock3 size={17} /><span>We’ll get back to you<br /><small>Usually within one working day.</small></span></div>
        </div>
        <div className="contact-form-wrap">
          {submitted ? (
            <div className="form-success" role="status">
              <span><Check size={21} /></span>
              <p className="eyebrow">Message received</p>
              <h2>Thanks for reaching out.</h2>
              <p>Your message is saved with our team. We’ll reply using the email address you provided.</p>
              <button className="text-link" type="button" onClick={() => { setSubmitted(false); setForm(initialForm); }}>
                Send another message <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Your name<input name="name" autoComplete="name" placeholder="How should we address you?" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
                <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
              </div>
              <div className="form-row">
                <label>Phone or WhatsApp <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" placeholder="+977 ..." value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
                <label>What can we help with?
                  <select name="topic" value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}>
                    <option value="">Choose a topic</option>
                    <option>Trekking in Nepal</option>
                    <option>A custom journey</option>
                    <option>Booking support</option>
                    <option>Something else</option>
                  </select>
                </label>
              </div>
              <label>Your message<textarea name="message" rows="5" placeholder="A rough idea is a lovely place to start." value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required /></label>
              {error && <p className="contact-form-error" role="alert">{error}</p>}
              <button className="button button-dark" type="submit" disabled={submitting}>
                <Send size={15} /> {submitting ? "Sending message..." : "Send message"}
              </button>
              <p className="form-privacy">Your details are used only to respond to this inquiry.</p>
            </form>
          )}
        </div>
      </section>
    </Page>
  );
}
