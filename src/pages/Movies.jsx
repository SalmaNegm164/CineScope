
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clapperboard } from "lucide-react";
import MovieCard from "../components/MovieCard";
import { getPopularMovies } from "../services/tmdb";
import "../styles/Catalog.css";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getPopularMovies(page);

        if (active) {
          setMovies(data.results || []);
          setTotalPages(Math.min(data.total_pages || 1, 500));
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load movies.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [page]);

  return (
    <main className="catalog-page">
      <header className="catalog-heading">
        <span className="catalog-eyebrow">
          <Clapperboard size={15} /> THE MOVIE COLLECTION
        </span>
        <h1>Popular <span>Movies</span></h1>
        <p>Explore popular titles and discover your next favorite.</p>
      </header>

      {loading ? (
        <div className="catalog-message">Loading movies...</div>
      ) : error ? (
        <div className="catalog-message">
          <p>{error}</p>
          <button type="button" onClick={() => setPage(page)}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="catalog-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <nav className="catalog-pagination" aria-label="Movie pages">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => {
                setPage((current) => current - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <ChevronLeft size={17} /> Previous
            </button>

            <span>Page {page} of {totalPages}</span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => {
                setPage((current) => current + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Next <ChevronRight size={17} />
            </button>
          </nav>
        </>
      )}
    </main>
  );
};

export default Movies;
