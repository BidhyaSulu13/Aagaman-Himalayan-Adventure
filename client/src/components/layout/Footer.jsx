import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Mountain, Phone } from "lucide-react";

export function Footer() {
  return (
    <>
      <footer className="trekking-footer light-theme-footer">
        <div className="section-wrap footer-content-wrap">
          <div className="footer-compact-grid">
            <div className="footer-compact-brand">
              <Link className="brand brand-footer" to="/">
                <span className="brand-logo-mark footer-mark"><Mountain size={22} /></span>
                <span className="brand-name">
                  <span className="brand-title">Agaaman</span>
                  <span className="brand-tagline">Himalayan Adventure</span>
                </span>
              </Link>
              <p>Thoughtful mountain journeys, planned with local knowledge and care.</p>
            </div>
            <nav className="footer-compact-links" aria-label="Footer exploration links">
              <strong>Explore</strong>
              <Link to="/treks">Nepal treks</Link>
              <Link to="/destinations">Destinations</Link>
              <Link to="/trekking-guide">Trekking guide</Link>
              <Link to="/journal">Journal</Link>
              <Link to="/review/request">Write a trek review</Link>
            </nav>
            <div className="footer-compact-contact">
              <strong>Talk to our team</strong>
              <a href="mailto:info@agaaman.com"><Mail size={15} /> info@agaaman.com</a>
              <a href="tel:+9779851029894"><Phone size={15} /> +977 9851029894</a>
              <span><MapPin size={15} /> Thamel, Kathmandu, Nepal</span>
              <Link className="footer-contact-link" to="/contact">Plan your trip <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="footer-bottom-bar">
            <span>© {new Date().getFullYear()} Agaaman Himalayan Adventure</span>
            <div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/about">About</Link></div>
          </div>
        </div>
      </footer>
      <a
        href="https://wa.me/9779851029894"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Chat on WhatsApp with local guide"
      >
        <MessageCircle size={25} />
      </a>
    </>
  );
}
