import { useEffect, useState } from "react";
import { Tv, ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "../components/MovieCard";
import { getPopularTV } from "../services/tmdb";
import "../styles/Catalog.css";

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    const loadShows = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getPopularTV(page);

        if (!active) return;

        setShows(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch {
        if (active) {
          setError("We couldn't load TV shows. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadShows();

    return () => {
      active = false;
    };
  }, [page, retry]);

  const changePage = (nextPage) => {
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="catalog-page">
      <section className="catalog-heading">
        <div className="catalog-heading__icon">
          <Tv size={24} />
        </div>
        <span className="details-eyebrow">YOUR NEXT BINGE STARTS HERE</span>
        <h1>TV Shows</h1>
        <p>
          Discover popular series, unforgettable characters, and stories
          worth staying up for.
        </p>
      </section>

      {loading ? (
        <div className="catalog-status">
          <div className="cine-loader" />
          <p>Finding your next favorite show...</p>
        </div>
      ) : error ? (
        <div className="catalog-status">
          <p>{error}</p>
          <button
            type="button"
            className="catalog-retry"
            onClick={() => setRetry((value) => value + 1)}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <section className="catalog-results">
            <div className="catalog-results__heading">
              <div>
                <span className="details-eyebrow">HANDPICKED FOR YOU</span>
                <h2>Popular Series</h2>
              </div>
              <span className="catalog-count">
                Page {page} of {totalPages}
              </span>
            </div>

            <div className="movie-grid">
              {shows.map((show) => (
                <MovieCard
                  key={show.id}
                  movie={{ ...show, media_type: "tv" }}
                />
              ))}
            </div>

            {shows.length === 0 && (
              <p className="catalog-empty">No TV shows found.</p>
            )}

            <div className="catalog-pagination">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={19} />
                Previous
              </button>

              <span>{page} / {totalPages}</span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => changePage(page + 1)}
                aria-label="Next page"
              >
                Next
                <ChevronRight size={19} />
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default TVShows;