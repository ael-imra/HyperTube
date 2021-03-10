import Axios from "axios";

export const GetListMovieFavorite = async () => {
  const favoriteMovie = await Axios.get(`/favorite/`, { withCredentials: true });
  const listFavorite = await Axios(`/favorite/imdbID`, { withCredentials: true });
  const listWatch = await Axios.get(`/movie/watched`, { withCredentials: true });
  if (favoriteMovie.data.body instanceof Array) {
    const listFavoriteMovie = favoriteMovie.data.body.map((movie) => ({
      image: `https://image.tmdb.org/t/p/original/${movie.movieImage}`,
      year: movie.movieRelease,
      titre: movie.movieTitle,
      description: movie.movieDescription,
      rating: movie.movieRating,
      runtime: movie.movieTime,
      genres: movie.movieGenre,
      language: movie.movieLanguage,
      imdbCode: movie.imdbID,
      id: movie.favoriteID,
      isFavorite: listFavorite.data.body instanceof Array && listFavorite.data.body.findIndex((a) => a.imdbID === movie.imdbID) === -1 ? false : true,
      isWatched: listWatch.data.body instanceof Array && listWatch.data.body.findIndex((a) => a.imdbID === movie.imdbID) !== -1 ? true : false,
    }));
    return listFavoriteMovie;
  } else return "noData";
};
