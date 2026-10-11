import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Clock3,
  Star,
  Play,
} from "lucide-react";
import {
  getMovieDetails,
  getImageUrl,
} from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import "../styles/MovieDetails.css";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("cinescope-watchlist") || "[]"
    );
    setWatchlist(saved);
  }, []);

  useEffect(() => {
    let active = true;

    const loadMovie = async () => {
      setLoading(true);
      setError("");
      setMovie(null);

      try {
        const data = await getMovieDetails(id);

        if (!active) return;

        setMovie(data);

        const videos = data.videos?.results || [];
        const selectedTrailer = videos.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official
        ) || videos.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer"
        );

        setTrailer(selectedTrailer || null);
      } catch {
        if (active) {
          setError("We couldn't load this movie. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMovie();

    return () => {
      active = false;
    };
  }, [id]);

  const toggleWatchlist = () => {
    const exists = watchlist.some((item) => item.id === movie.id);

    const updated = exists
      ? watchlist.filter((item) => item.id !== movie.id)
      : [...watchlist, movie];

    setWatchlist(updated);
    localStorage.setItem(
      "cinescope-watchlist",
      JSON.stringify(updated)
    );
  };

  if (loading) {
    return (
      <main className="movie-details-status">
        <div className="cine-loader" />
        <p>Loading movie details...</p>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="movie-details-status">
        <p>{error || "Movie not found."}</p>
        <Link to="/movies" className="details-back-link">
          <ArrowLeft size={18} />
          Browse Movies
        </Link>
      </main>
    );
  }

  const isSaved = watchlist.some((item) => item.id === movie.id);
  const backdrop = getImageUrl(movie.backdrop_path, "original");
  const poster = getImageUrl(movie.poster_path);
  const releaseYear = movie.release_date?.slice(0, 4) || "N/A";
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "Runtime unavailable";

  return (
    <main className="movie-details-page">
      <section
        className="details-hero"
        style={
          backdrop
            ? { "--details-backdrop": `url("${backdrop}")` }
            : undefined
        }
      >
        <div className="details-hero__content">
          <Link to="/movies" className="details-back-link">
            <ArrowLeft size={18} />
            Back to Movies
          </Link>

          <div className="details-main">
            <div className="details-poster">
              {poster ? (
                <img src={poster} alt={`${movie.title} poster`} />
              ) : (
                <div className="details-poster__placeholder">
                  No poster available
                </div>
              )}
            </div>

            <div className="details-info">
              <span className="details-eyebrow">MOVIE SPOTLIGHT</span>
              <h1>{movie.title}</h1>

              {movie.tagline && (
                <p className="details-tagline">“{movie.tagline}”</p>
              )}

              <div className="details-meta">
                <span>
                  <CalendarDays size={16} />
                  {releaseYear}
                </span>
                <span>
                  <Clock3 size={16} />
                  {runtime}
                </span>
                {movie.vote_average > 0 && (
                  <span className="details-rating">
                    <Star size={16} fill="currentColor" />
                    {movie.vote_average.toFixed(1)}
                    <small>/ 10</small>
                  </span>
                )}
              </div>

              <div className="details-genres">
                {movie.genres?.map((genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
              </div>

              <h2>Overview</h2>
              <p className="details-overview">
                {movie.overview || "No overview is available for this movie."}
              </p>

              <div className="details-actions">
                <button
                  type="button"
                  className="details-watchlist-button"
                  onClick={toggleWatchlist}
                >
                  <Bookmark
                    size={18}
                    fill={isSaved ? "currentColor" : "none"}
                  />
                  {isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
                </button>

                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noreferrer"
                    className="details-trailer-button"
                  >
                    <Play size={18} fill="currentColor" />
                    Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {movie.credits?.cast?.length > 0 && (
        <section className="details-section">
          <div className="details-section__heading">
            <div>
              <span className="details-eyebrow">THE PEOPLE BEHIND IT</span>
              <h2>Top Cast</h2>
            </div>
          </div>

          <div className="cast-grid">
            {movie.credits.cast.slice(0, 6).map((person) => (
              <article className="cast-card" key={person.id}>
                {person.profile_path ? (
                  <img
                    src={getImageUrl(person.profile_path, "w185")}
                    alt={person.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="cast-card__placeholder">
                    {person.name?.charAt(0) || "?"}
                  </div>
                )}
                <div>
                  <h3>{person.name}</h3>
                  <p>{person.character || "Cast member"}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {movie.similar?.results?.length > 0 && (
        <section className="details-section details-similar">
          <div className="details-section__heading">
            <div>
              <span className="details-eyebrow">MORE TO EXPLORE</span>
              <h2>You Might Also Like</h2>
            </div>
          </div>

          <div className="movie-grid">
            {movie.similar.results.slice(0, 5).map((similarMovie) => (
              <MovieCard
                key={similarMovie.id}
                movie={similarMovie}
                isInWatchlist={watchlist.some(
                  (item) => item.id === similarMovie.id
                )}
                onToggleWatchlist={(selectedMovie) => {
                  const exists = watchlist.some(
                    (item) => item.id === selectedMovie.id
                  );

                  const updated = exists
                    ? watchlist.filter(
                        (item) => item.id !== selectedMovie.id
                      )
                    : [...watchlist, selectedMovie];

                  setWatchlist(updated);
                  localStorage.setItem(
                    "cinescope-watchlist",
                    JSON.stringify(updated)
                  );
                }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default MovieDetails;