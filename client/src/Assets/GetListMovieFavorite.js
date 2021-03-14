import Axios from "axios";

export const GetListMovieFavorite = async () => {
  const favoriteMovie = await Axios.get(`/favorite/`, { withCredentials: true });
  if (favoriteMovie.data.body instanceof Array) {
    const listFavoriteMovie = favoriteMovie.data.body.map((movie) => ({
      image: `https://image.tmdb.org/t/p/original/${movie.movieImage}`,
      year: movie.movieRelease,
      titre: movie.movieTitle,
      description: movie.movieDescription,
      rating: movie.movieRating,
      runtime: movie.movieTime,
      genres: movie.movieGenre ? JSON.parse(movie.movieGenre) : [],
      language: movie.movieLanguage,
      imdbCode: movie.imdbID,
      id: movie.favoriteID,
      isFavorite: true,
      isWatched: movie.watched,
    }));
    return listFavoriteMovie;
  } else return "noData";
};
