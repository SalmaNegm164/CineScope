
import { Link } from "react-router-dom";
import { Clapperboard } from "lucide-react";
import "../styles/Catalog.css";

const NotFound = () => (
  <main className="not-found-page">
    <Clapperboard size={42} />
    <span className="not-found-code">404</span>
    <h1>This scene doesn't exist.</h1>
    <p>The page you're looking for couldn't be found.</p>
    <Link to="/" className="catalog-primary-link">
      Back to Discover
    </Link>
  </main>
);

export default NotFound;
