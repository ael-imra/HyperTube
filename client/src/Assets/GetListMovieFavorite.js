import Axios from 'axios';

export const GetListMovieFavorite = async () => {
  const favoriteMovie = await Axios.get(`http://localhost:1337/favorite/`, { withCredentials: true });
  const test = favoriteMovie.data.body.map((movie) => ({
    image: `https://image.tmdb.org/t/p/original/${movie.movieImage}`,
    year: movie.movieRelease,
    titre: movie.movieTitle,
    description: movie.movieDescription,
    rating: 45,
    runtime: movie.movieTime,
    genres: movie.genres ? ['Adventure', 'Action'] : [],
    language: movie.movieLanguage,
    imdbCode: movie.imdbID,
    id: movie.favoriteID,
  }));
  return test;
};
