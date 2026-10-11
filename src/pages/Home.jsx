
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Clapperboard,
  Play,
  RefreshCw,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import MovieCard from "../components/MovieCard";
import {
  getTrendingMovies,
  getPopularMovies,
  getImageUrl,
} from "../services/tmdb";
import "../styles/Home.css";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [watchlist, setWatchlist] = useState([]);

  const loadMovies = async () => {
    setLoading(true);
    setError("");

    try {
      const [trendingData, popularData] = await Promise.all([
        getTrendingMovies(),
        getPopularMovies(),
      ]);

      setTrending(
        (trendingData.results || []).filter(
          (movie) => !movie.media_type || movie.media_type === "movie"
        )
      );

      setPopular(popularData.results || []);
    } catch (err) {
      setError(
        err.message || "Something went wrong while loading movies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("cinescope-watchlist") || "[]"
      );

      setWatchlist(Array.isArray(saved) ? saved : []);
    } catch {
      setWatchlist([]);
    }
  }, []);

  const toggleWatchlist = (movie) => {
    setWatchlist((current) => {
      const exists = current.some((item) => item.id === movie.id);

      const updated = exists
        ? current.filter((item) => item.id !== movie.id)
        : [...current, movie];

      try {
        localStorage.setItem(
          "cinescope-watchlist",
          JSON.stringify(updated)
        );
      } catch {
        console.error("Unable to save the watchlist.");
      }

      return updated;
    });
  };

  const featured = trending.find((movie) => movie.backdrop_path);

  const isSaved = (movie) =>
    watchlist.some((item) => item.id === movie.id);

  if (loading) {
    return (
      <main className="home-status">
        <div className="home-status__spinner" />
        <p>Discovering your next favorite movie...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-status">
        <div className="home-status__icon">
          <Clapperboard size={30} />
        </div>
        <h2>We couldn't load the movies</h2>
        <p>{error}</p>
        <button
          type="button"
          className="home-button home-button--primary"
          onClick={loadMovies}
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="home-page">
      {featured && (
        <section
          className="home-hero"
          style={{
            "--hero-image": `url("${getImageUrl(
              featured.backdrop_path,
              "w1280"
            )}")`,
          }}
        >
          <div className="home-hero__content">
            <span className="home-eyebrow">
              <Sparkles size={15} />
              YOUR NEXT FAVORITE FILM
            </span>

            <h1>
              Stories worth
              <span> watching.</span>
            </h1>

            <p className="home-hero__description">
              Discover extraordinary movies, explore new worlds, and
              find the stories you won't forget.
            </p>

            <div className="home-hero__featured">
              <span className="home-hero__tag">
                <TrendingUp size={15} />
                Trending this week
              </span>

              <h2>{featured.title || featured.name}</h2>

              <div className="home-hero__meta">
                {featured.vote_average > 0 && (
                  <span>
                    <Star size={15} fill="currentColor" />
                    {featured.vote_average.toFixed(1)} Rating
                  </span>
                )}

                {featured.release_date && (
                  <span>
                    {featured.release_date.slice(0, 4)}
                  </span>
                )}
              </div>

              <p className="home-hero__overview">
                {featured.overview ||
                  "An unforgettable story is waiting to be discovered."}
              </p>
            </div>

            <div className="home-hero__actions">
              <Link
                to={`/movie/${featured.id}`}
                className="home-button home-button--primary"
              >
                <Play size={17} fill="currentColor" />
                Explore Movie
              </Link>

              <a
                href="#trending"
                className="home-button home-button--secondary"
              >
                Discover More
                <ArrowRight size={17} />
              </a>
            </div>
          </div>

          <div className="home-hero__bottom">
            <span>CURATED FOR MOVIE LOVERS</span>
            <span>01 / DISCOVER</span>
          </div>
        </section>
      )}

      <div className="home-content">
        <section className="home-section" id="trending">
          <div className="home-section__heading">
            <div>
              <span className="home-section__eyebrow">
                <TrendingUp size={15} />
                WHAT'S HOT
              </span>
              <h2>Trending <span>Now</span></h2>
              <p>The movies everyone's talking about.</p>
            </div>

            <span className="home-section__count">
              {trending.length} titles
            </span>
          </div>

          {trending.length > 0 ? (
            <div className="home-movie-grid">
              {trending.slice(0, 10).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWatchlist={isSaved(movie)}
                  onToggleWatchlist={toggleWatchlist}
                />
              ))}
            </div>
          ) : (
            <p className="home-empty">
              No trending movies are available right now.
            </p>
          )}
        </section>

        <section className="home-section" id="popular">
          <div className="home-section__heading">
            <div>
              <span className="home-section__eyebrow">
                <Star size={15} />
                HANDPICKED FOR YOU
              </span>
              <h2>Popular <span>Picks</span></h2>
              <p>Popular movies worth adding to your list.</p>
            </div>

            <Link to="/movies" className="home-view-all">
              View All
              <ChevronRight size={17} />
            </Link>
          </div>

          {popular.length > 0 ? (
            <div className="home-movie-grid">
              {popular.slice(0, 10).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWatchlist={isSaved(movie)}
                  onToggleWatchlist={toggleWatchlist}
                />
              ))}
            </div>
          ) : (
            <p className="home-empty">
              No popular movies are available right now.
            </p>
          )}
        </section>

        <section className="home-discover-banner">
          <div className="home-discover-banner__icon">
            <Clapperboard size={27} />
          </div>

          <div>
            <h2>Your next movie night starts here.</h2>
            <p>Explore stories. Save favorites. Build your watchlist.</p>
          </div>

          <Link to="/watchlist" className="home-discover-banner__link">
            My Watchlist
            <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    </main>
  );
};

export default Home;
