
import { getTrendingMovies, getImageUrl } from "./tmdb";

async function testTMDB() {
  try {
    const data = await getTrendingMovies();

    console.log("TMDB connection successful!");
    console.log("Number of movies:", data.results.length);
    console.log("First movie:", data.results[0]);
    console.log(
      "First movie poster:",
      getImageUrl(data.results[0]?.poster_path)
    );
  } catch (error) {
    console.error("TMDB test failed:", error.message);
  }
}

testTMDB();
