import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function SectionHeading({ eyebrow, title, copy, link, to = "/treks", light = false }) {
  return (
    <div className={`section-heading${light ? " section-heading-light" : ""}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {copy && <p className="section-copy">{copy}</p>}
      </div>
      {link && <Link className="text-link" to={to}>{link} <ArrowUpRight size={15} /></Link>}
    </div>
  );
}
