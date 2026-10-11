import { useState } from "react";
import { Star, CalendarDays, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdb";
import "../styles/MovieCard.css";

const WATCHLIST_KEY = "cinescope-watchlist";

const MovieCard = ({
  movie,
  onToggleWatchlist,
  isInWatchlist = false,
}) => {
  const [savedLocally, setSavedLocally] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(WATCHLIST_KEY) || "[]"
      );
      return saved.some((item) => item.id === movie.id);
    } catch {
      return false;
    }
  });

  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? releaseDate.slice(0, 4) : "N/A";
  const poster = getImageUrl(movie.poster_path);
  const title = movie.title || movie.name || "Untitled";
  const saved = onToggleWatchlist ? isInWatchlist : savedLocally;

  const handleToggleWatchlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onToggleWatchlist) {
      onToggleWatchlist(movie);
      return;
    }

    try {
      const current = JSON.parse(
        localStorage.getItem(WATCHLIST_KEY) || "[]"
      );

      const exists = current.some((item) => item.id === movie.id);

      const updated = exists
        ? current.filter((item) => item.id !== movie.id)
        : [...current, movie];

      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
      setSavedLocally(!exists);
    } catch (error) {
      console.error("Could not update watchlist:", error);
    }
  };

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        {poster ? (
          <img
            src={poster}
            alt={`${title} poster`}
            loading="lazy"
          />
        ) : (
          <div className="movie-card__placeholder">
            No poster available
          </div>
        )}

        <div className="movie-card__overlay">
          <Link
            to={`/movie/${movie.id}`}
            className="movie-card__details"
          >
            View Details
          </Link>
        </div>

        {movie.vote_average > 0 && (
          <span className="movie-card__rating">
            <Star size={14} fill="currentColor" />
            {movie.vote_average.toFixed(1)}
          </span>
        )}

        <button
          type="button"
          className={`movie-card__bookmark ${saved ? "is-saved" : ""}`}
          aria-label={
            saved ? "Remove from watchlist" : "Add to watchlist"
          }
          aria-pressed={saved}
          onClick={handleToggleWatchlist}
        >
          <Bookmark
            size={18}
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="movie-card__info">
        <Link
          to={`/movie/${movie.id}`}
          className="movie-card__title"
        >
          {title}
        </Link>

        <div className="movie-card__meta">
          <span>
            <CalendarDays size={14} />
            {year}
          </span>
          <span className="movie-card__type">
            {movie.media_type === "tv" ? "TV Series" : "Movie"}
          </span>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;