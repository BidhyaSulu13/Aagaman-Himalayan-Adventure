import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Mail, MapPin, MessageCircle, Mountain, Phone, Send } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <>
      <footer className="trekking-footer light-theme-footer">
        <div className="footer-overlay" />
        <div className="section-wrap footer-content-wrap">
          {/* Main Footer Columns */}
          <div className="footer-columns-grid">
            {/* Column 1: Brand & We Accept */}
            <div className="footer-brand-col">
              <Link className="brand brand-footer" to="/">
                <div className="brand-logo-mark footer-mark">
                  <Mountain size={24} strokeWidth={2} />
                </div>
                <span className="brand-name">
                  <span className="brand-title">Agaaman</span>
                  <span className="brand-tagline">Himalayan Adventure</span>
                </span>
              </Link>
              <p className="footer-brand-text">
                Leading adventure hiking, tour, and trekking company of Nepal. Crafted by local Sherpas with over two decades of mountain expeditions.
              </p>

              {/* WE ACCEPT */}
              <div className="we-accept-block">
                <span className="we-accept-title">WE ACCEPT</span>
                <div className="payment-badges-row">
                  <span className="pay-card visa">VISA</span>
                  <span className="pay-card mastercard">MC</span>
                  <span className="pay-card discover">DISC</span>
                  <span className="pay-card jcb">JCB</span>
                  <span className="pay-card diners">DINERS</span>
                  <span className="pay-card amex">AMEX</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links 1 */}
            <div className="footer-links-col">
              <ul>
                <li><Link to="/about">Affiliate Program</Link></li>
                <li><Link to="/trekking-guide">FAQs</Link></li>
                <li><Link to="/journal">Blogs & Stories</Link></li>
                <li><Link to="/contact">Payment Info</Link></li>
                <li><Link to="/terms">Legal Documents</Link></li>
                <li><Link to="/#group-departures">Group Joining Treks</Link></li>
                <li><Link to="/treks">Read Reviews</Link></li>
                <li><Link to="/admin" style={{ color: "#ea580c", fontWeight: 700 }}>⚡ Admin Dashboard</Link></li>
                <li><Link to="/dashboard">Traveler Portal</Link></li>
              </ul>
            </div>

            {/* Column 3: Quick Links 2 */}
            <div className="footer-links-col">
              <ul>
                <li><Link to="/destinations">Bhutan Travel Info</Link></li>
                <li><Link to="/destinations">India Travel Info</Link></li>
                <li><Link to="/destinations">Nepal Travel Info</Link></li>
                <li><Link to="/destinations">Tibet Travel Info</Link></li>
                <li><Link to="/journal">Latest News</Link></li>
                <li><Link to="/find-my-trek">Personalize Trip</Link></li>
                <li><Link to="/treks">Photo Gallery</Link></li>

              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="footer-newsletter-col">
              <span className="newsletter-heading">Newsletter</span>
              <p className="newsletter-sub">Subscribe to our newsletter to get the latest trail updates, route permits, and seasonal discounts.</p>

              {subscribed ? (
                <div className="newsletter-success-box">
                  <Check size={16} /> Thank you! You're subscribed.
                </div>
              ) : (
                <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                  <button type="submit" className="footer-sub-btn">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* International Office Contact Banner */}
          <div className="international-offices-card">
            {/* Nepal Office */}
            <div className="office-col">
              <div className="office-title-row">
                <span className="country-code">NP</span>
                <h4>Nepal</h4>
              </div>
              <p className="office-address">
                <MapPin size={15} /> Thamel, Kathmandu (Opposite of LOD)
              </p>
              <p className="office-phone">
                <Phone size={15} /> +977 9851029894, Operation;
              </p>
              <p className="office-email">
                <Mail size={15} /> info@agaaman.com
              </p>
            </div>


          </div>

          {/* Copyright bar */}
          <div className="footer-bottom-bar">
            <span>2016 - 2026 © Agaaman: A Himalayan Adventure. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp chat button */}
      <a
        href="https://wa.me/9779851029894"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Chat on WhatsApp with local guide"
      >
        <MessageCircle size={28} />
      </a>
    </>
  );
}