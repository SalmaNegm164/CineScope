
import { useEffect, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../services/tmdb";
import "../styles/Catalog.css";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [input, setInput] = useState(query);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setInput(query);

    if (!query.trim()) {
      setMovies([]);
      setLoading(false);
      setError("");
      return;
    }

    let active = true;
    setLoading(true);
    setError("");

    const timer = setTimeout(async () => {
      try {
        const data = await searchMovies(query);

        if (active) setMovies(data.results || []);
      } catch (err) {
        if (active) {
          setError(err.message || "Search failed.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const submitSearch = (event) => {
    event.preventDefault();
    const value = input.trim();

    if (value) {
      setSearchParams({ query: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main className="catalog-page search-page">
      <header className="catalog-heading">
        <span className="catalog-eyebrow">FIND YOUR NEXT FAVORITE</span>
        <h1>Search <span>Movies</span></h1>
        <p>Search for titles and explore the stories behind them.</p>
      </header>

      <form className="search-form" onSubmit={submitSearch}>
        <SearchIcon size={21} />
        <input
          type="search"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Search movies by title..."
          aria-label="Search movies by title"
        />
        {input && (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => {
              setInput("");
              setSearchParams({});
            }}
          >
            <X size={18} />
          </button>
        )}
        <button type="submit" className="search-submit">
          Search
        </button>
      </form>

      {!query.trim() ? (
        <div className="catalog-message">
          Start by entering a movie title above.
        </div>
      ) : loading ? (
        <div className="catalog-message">Searching movies...</div>
      ) : error ? (
        <div className="catalog-message">{error}</div>
      ) : (
        <>
          <div className="search-results-heading">
            <h2>Results for “{query}”</h2>
            <span>{movies.length} results on this page</span>
          </div>

          {movies.length ? (
            <div className="catalog-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="catalog-message">
              No matching movies found. Try another title.
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Search;
