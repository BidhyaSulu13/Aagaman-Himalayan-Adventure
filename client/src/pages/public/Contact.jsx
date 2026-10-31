import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Clock3, MapPin } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { DemoBanner } from "../../components/common/PagePrimitives.jsx";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <Page className="contact-page">
      <DemoBanner />
      <section className="contact-layout section-wrap">
        <div className="contact-intro">
          <p className="eyebrow">A first hello</p>
          <h1>Tell us what<br /><em>you’re dreaming of.</em></h1>
          <p>Ask a question, share an idea, or tell us how you like to travel. We’ll use this demo form to show the inquiry experience—nothing is sent or stored.</p>
          <div className="contact-side-note"><MapPin size={17} /><span>Based in Kathmandu, Nepal<br /><small>Project demonstration · no live office</small></span></div>
          <div className="contact-side-note"><Clock3 size={17} /><span>Take your time<br /><small>Good journeys don't need to be rushed.</small></span></div>
        </div>
        <div className="contact-form-wrap">
          {submitted ? (
            <div className="form-success" role="status"><span><Check size={21} /></span><p className="eyebrow">Demo response</p><h2>Your note is ready.</h2><p>No message was sent; the backend is not connected yet. Thanks for trying the form.</p><button className="text-link" type="button" onClick={() => setSubmitted(false)}>Write another note <ArrowRight size={15} /></button></div>
          ) : (
            <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="How should we address you?" required /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label></div>
              <label>What kind of journey are you imagining?<select defaultValue=""><option value="" disabled>Choose an option</option><option>Trekking in Nepal</option><option>A custom journey</option><option>Just exploring for now</option><option>Something else</option></select></label>
              <label>Anything else we should know?<textarea name="message" rows="5" placeholder="A rough idea is a lovely place to start." required /></label>
              <button className="button button-dark" type="submit">Preview inquiry <ArrowUpRight size={15} /></button>
              <p className="form-privacy">Demonstration only: your details are not transmitted, saved, or shared.</p>
            </form>
          )}
        </div>
      </section>
    </Page>
  );
}
