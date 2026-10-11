
import { useEffect, useState } from "react";
import { Bookmark, Clapperboard } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import "../styles/Catalog.css";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);

  const loadWatchlist = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("cinescope-watchlist") || "[]"
      );

      setMovies(Array.isArray(saved) ? saved : []);
    } catch {
      setMovies([]);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const removeMovie = (movie) => {
    const updated = movies.filter((item) => item.id !== movie.id);

    setMovies(updated);
    localStorage.setItem("cinescope-watchlist", JSON.stringify(updated));
  };

  return (
    <main className="catalog-page">
      <header className="catalog-heading">
        <span className="catalog-eyebrow">
          <Bookmark size={15} /> YOUR PERSONAL COLLECTION
        </span>
        <h1>My <span>Watchlist</span></h1>
        <p>All the movies you saved, together in one place.</p>
      </header>

      {movies.length ? (
        <>
          <div className="watchlist-summary">
            <Bookmark size={18} />
            {movies.length} saved {movies.length === 1 ? "movie" : "movies"}
          </div>

          <div className="catalog-grid">
            {movies.map((movie) => (
              <div className="watchlist-item" key={movie.id}>
                <MovieCard
                  movie={movie}
                  isInWatchlist
                  onToggleWatchlist={removeMovie}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <section className="watchlist-empty">
          <div className="watchlist-empty__icon">
            <Clapperboard size={30} />
          </div>
          <h2>Your watchlist is waiting.</h2>
          <p>Save movies you love and find them here whenever you're ready.</p>
          <Link to="/" className="catalog-primary-link">
            Discover Movies
          </Link>
        </section>
      )}
    </main>
  );
};

export default Watchlist;
