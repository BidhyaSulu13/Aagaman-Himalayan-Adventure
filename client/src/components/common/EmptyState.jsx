import { ArrowUpRight, Mountain } from "lucide-react";
import { Link } from "react-router-dom";
import { treks } from "../../data/index.js";

export function EmptyState({ title, copy, action, to = "/treks" }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon"><Mountain size={24} /></span>
      <h3>{title}</h3>
      <p>{copy}</p>
      {action && <Link className="button button-dark" to={to}>{action} <ArrowUpRight size={15} /></Link>}
    </div>
  );
}

export function AllTreksCount() {
  return <span>{treks.length} journeys to explore</span>;
}
