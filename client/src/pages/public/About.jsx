import { Link } from "react-router-dom";
import { ArrowUpRight, Compass, Leaf, Users } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { SectionHeading } from "../../components/common/SectionHeading.jsx";
import { heroImage, Image } from "../../components/common/PagePrimitives.jsx";

export function AboutPage() {
  return (
    <Page className="about-page">
      <section className="about-hero section-wrap">
        <p className="eyebrow">Explore the Himalayas</p>
        <h1>Not here to<br /><em>collect summits.</em></h1>
        <p>Here to make space for the kind of journey that stays with you long after the trail ends.</p>
      </section>
      <section className="about-image-band"><Image src={heroImage} alt="Himalayan mountain range with a quiet sky" /></section>
      <section className="section-wrap about-story">
        <div><p className="eyebrow">Our point of view</p><h2>Go thoughtfully.<br />Come back changed.</h2></div>
        <div><p>Agaaman Himalayan Adventure brings trek listings, destinations, regions, and scheduled departures together in one place.</p><p>Explore the current catalog to compare published routes and review the information available for each trip. Conditions, requirements, and availability can change, so confirm important details before making travel plans.</p><Link className="text-link" to="/contact">Tell us what you’re imagining <ArrowUpRight size={15} /></Link></div>
      </section>
      <section className="values-section"><div className="section-wrap"><SectionHeading eyebrow="Our approach" title="Curiosity, care, and a little more time." /><div className="values-grid">{[[<Leaf size={20} />, "Care for place", "The landscape is more than a backdrop. We want every plan to start with respect."], [<Users size={20} />, "Local perspectives", "Travel experiences should make space for the knowledge and livelihoods of local communities."], [<Compass size={20} />, "Honest guidance", "Clear expectations are better than big promises. Especially in the mountains."]].map(([icon, title, copy]) => <div className="value-card" key={title}><span className="value-icon">{icon}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></div></section>
      <section className="section-wrap about-cta"><p className="eyebrow">Ready when you are</p><h2>Start with a question.<br /><em>Follow it into the hills.</em></h2><Link className="button button-dark" to="/find-my-trek">Find your trail <ArrowUpRight size={15} /></Link></section>
    </Page>
  );
}
