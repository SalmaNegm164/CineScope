import { Clapperboard, Heart, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="cine-footer">
      <div className="cine-footer__main">
        <div className="cine-footer__brand">
          <Link to="/" className="cine-brand">
            <span className="cine-brand__icon">
              <Clapperboard size={23} strokeWidth={2.2} />
            </span>
            <span className="cine-brand__name">
              Cine<span>Scope</span>
            </span>
          </Link>

          <p>
            Discover your next favorite story. Explore movies, find hidden
            gems, and build your personal watchlist.
          </p>
        </div>

        <div className="cine-footer__links">
          <h3>Explore</h3>
          <Link to="/">Discover</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/tv">TV Shows</Link>
          <Link to="/watchlist">My Watchlist</Link>
        </div>

        <div className="cine-footer__links">
          <h3>Your Next Watch</h3>
          <p>Great stories are always worth discovering.</p>
          <Link to="/search" className="cine-footer__discover">
            Find a Movie <span>↗</span>
          </Link>
        </div>
      </div>

      <div className="cine-footer__bottom">
        <p>
          © {new Date().getFullYear()} CineScope. All rights reserved.
        </p>

        <p className="cine-footer__credit">
          Made with <Heart size={14} fill="currentColor" /> for movie lovers
        </p>

        <button
          type="button"
          className="cine-footer__top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      </div>

      <p className="cine-footer__attribution">
        Movie data and images provided by TMDB. This product uses the TMDB API
        but is not endorsed or certified by TMDB.
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
        >
          Visit TMDB
        </a>
      </p>
    </footer>
  );
};

export default Footer;