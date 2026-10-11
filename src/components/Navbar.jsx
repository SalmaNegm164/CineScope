
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Clapperboard, Menu, Search, X } from "lucide-react";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="cine-navbar">
      <div className="cine-navbar__inner">
        <Link to="/" className="cine-brand" onClick={closeMenu}>
          <span className="cine-brand__icon">
            <Clapperboard size={23} strokeWidth={2.2} />
          </span>
          <span className="cine-brand__name">
            Cine<span>Scope</span>
          </span>
        </Link>

        <nav className={`cine-nav ${menuOpen ? "is-open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Discover
          </NavLink>
          <NavLink to="/movies" onClick={closeMenu}>
            Movies
          </NavLink>
          <NavLink to="/tv" onClick={closeMenu}>
            TV Shows
          </NavLink>
          <NavLink to="/watchlist" onClick={closeMenu}>
            My Watchlist
          </NavLink>
        </nav>

        <div className="cine-navbar__actions">
          <Link
            to="/search"
            className="cine-search-button"
            aria-label="Search movies"
          >
            <Search size={20} />
          </Link>

          <button
            type="button"
            className="cine-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
