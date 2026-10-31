import { Link } from "react-router-dom";
import { ArrowUpRight, Mountain } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { DemoBanner } from "../../components/common/PagePrimitives.jsx";

export function NotFoundPage() {
  return (
    <Page className="not-found-page">
      <span className="not-found-icon"><Mountain size={26} /></span>
      <p className="eyebrow">A path less traveled</p>
      <h1>This trail<br /><em>isn't on our map.</em></h1>
      <p>The page may have moved, or we may still be making our way there.</p>
      <Link className="button button-dark" to="/">Find your way home <ArrowUpRight size={15} /></Link>
    </Page>
  );
}

export function PolicyPage({ kind }) {
  const isPrivacy = kind === "privacy";
  return (
    <Page className="article-page">
      <DemoBanner />
      <article className="article-wrap policy-wrap">
        <p className="eyebrow">Project demonstration · draft policy</p>
        <h1>{isPrivacy ? "Privacy, plainly." : "A few terms for the trail."}</h1>
        <p className="article-lede">This page is a project placeholder, not a final legal policy. Review with appropriate guidance before using a live service.</p>
        <div className="article-body">
          {isPrivacy ? <>
            <h2>What this demo stores</h2>
            <p>Saved trek choices are stored in local browser storage on this device. No account, booking, contact message or newsletter subscription is sent to a server by this frontend.</p>
            <h2>External services</h2>
            <p>Map tiles are provided by OpenStreetMap contributors. Images and web fonts load from their respective external hosts and may transmit normal browser request information to those providers.</p>
            <h2>When this becomes a live service</h2>
            <p>Replace this draft with a reviewed policy explaining data collection, retention, access, cookies, service providers and contact details before collecting personal information.</p>
          </> : <>
            <h2>Demonstration content</h2>
            <p>Trek descriptions, routes, prices, coordinates and editorial content on this site are illustrative. They are not a live offer, verified itinerary, availability statement or safety recommendation.</p>
            <h2>No bookings or travel advice</h2>
            <p>Submitting a form does not make a reservation, create an account or initiate payment. Verify current trail conditions, permits, health guidance and local arrangements with qualified sources.</p>
            <h2>Before public launch</h2>
            <p>Replace this draft with reviewed terms, policies, operator information and support contacts appropriate to the final service.</p>
          </>}
        </div>
      </article>
    </Page>
  );
}
