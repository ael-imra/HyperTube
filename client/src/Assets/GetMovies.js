import Axios from 'axios';
export const GetMovies = async (page, oldValue, search) => {
  let { years, rating, order, genre, title, sort } = search;
  if (sort === '') sort = 'download_count';
  if (genre === 'All') genre = '';
  let test = await new Promise(async (resolve) => {
    let arrayMovies;
    const rog = [];
    let movies = [];
    let i = page;
    while (i) {
      arrayMovies = await Axios.get(`https://yts.megaproxy.info/api/v2/list_movies.json?page=${i}&minimum_rating=${rating}&genre=${genre}&limit=30&query_term=${title}&sort_by=${sort}&order_by=${order}`);
      if (arrayMovies.data.data.movies) {
        arrayMovies.data.data.movies.forEach((movie) => {
          if (oldValue.findIndex((element) => element.id === movie.id) === -1 && (!years || movie.year === years))
            rog.push({
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
        i++;
        movies = [...oldValue, ...rog];
        if (rog.length >= 20) break;
      } else break;
    }
    resolve({ list: movies, page: i, next: arrayMovies.data.data.movie_count > movies.length, middleware: false });
  });
  return test;
};
