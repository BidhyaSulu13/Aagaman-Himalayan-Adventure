import { Link } from "react-router-dom";
import { ArrowUpRight, Mountain } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";

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
      <article className="article-wrap policy-wrap">
        <p className="eyebrow">Draft policy · review before production use</p>
        <h1>{isPrivacy ? "Privacy, plainly." : "A few terms for the trail."}</h1>
        <p className="article-lede">This draft is not legal advice or a final policy. Review it against your actual operations and applicable requirements before production use.</p>
        <div className="article-body">
          {isPrivacy ? <>
            <h2>Information handled by the application</h2>
            <p>Depending on the feature, information submitted through account, booking, contact, and review forms is sent to the configured API and may be stored in its database. Some preferences may be stored in the browser. Confirm what is collected, how long it is retained, who can access it, and how requests are handled before production use.</p>
            <h2>External services</h2>
            <p>Map tiles are provided by OpenStreetMap contributors. Images and web fonts load from their respective external hosts and may transmit normal browser request information to those providers.</p>
            <h2>Before production use</h2>
            <p>Replace this draft with a reviewed policy explaining data collection, retention, access, cookies, service providers, user rights, and contact details.</p>
          </> : <>
            <h2>Catalog information</h2>
            <p>Trek, destination, region, price, and departure information is displayed from the records currently available in the catalog. Details may be incomplete or change; confirm itinerary, inclusions, pricing, and availability with the operator before making travel arrangements.</p>
            <h2>Booking requests and travel information</h2>
            <p>A booking request is subject to operator review and is not a confirmed reservation or payment. Information on this site is general and should not replace current guidance from relevant authorities or qualified health professionals.</p>
            <h2>Before public launch</h2>
            <p>Replace this draft with reviewed terms, cancellation and payment rules, operator information, and support contacts appropriate to the service.</p>
          </>}
        </div>
      </article>
    </Page>
  );
}
