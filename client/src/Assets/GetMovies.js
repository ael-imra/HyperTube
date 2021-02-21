import Axios from 'axios';
export const GetMovies = async (page, oldValue, query) => {
  let arrayMovies;
  if (query && query !== '') arrayMovies = await Axios.get(`https://yts.megaproxy.info/api/v2/list_movies.json?page=${page}&limit=30&query_term=${query}`);
  else arrayMovies = await Axios.get(`https://yts.megaproxy.info/api/v2/list_movies.json?page=${page}&limit=30`);
  const roger = [];
  if (arrayMovies.data.data.movies)
    arrayMovies.data.data.movies.forEach((movie) => {
      if (oldValue.findIndex((element) => element.id === movie.id) === -1)
        roger.push({
          image: movie.large_cover_image,
          year: movie.year,
          titre: movie.title_english,
          description: movie.summary,
          rating: movie.rating,
          runtime: movie.runtime,
          genres: movie.genres ? movie.genres : [],
          language: movie.language,
          imdbCode: movie.imdb_code,
          id: movie.id,
        });
    });
  return [...oldValue, ...roger];
};
