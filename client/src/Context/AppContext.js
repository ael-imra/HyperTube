import React, { useState, createContext } from 'react';
import { Languages } from '../Assets/language';
import { Validator } from '../Assets/validator';
import { UseWindowSize } from '../Assets/UseWindowSize';
import { useHistory } from 'react-router-dom';

import { GetMovies } from '../Assets/GetMovies';

export const DataContext = createContext();
export default function AppContext(props) {
  const [Lang, setLang] = useState('Eng');
  const width = UseWindowSize();
  let history = useHistory();
  const ref = {};
  const cache = {
    listMovies: { list: [], page: 0, next: false },
    listPopularMovies: {},
  };
  // useEffect(async () => {
  //   const popularMovies = await Axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=7a518fe1d1c5359a4929ef4765c347fb`);
  //   const detailPopularMovies = await new Promise((resolve) => {
  //     const result = [];
  //     popularMovies.data.results.map(async (movie) => {
  //       const image = await Axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=7a518fe1d1c5359a4929ef4765c347fb`);
  //       result.push({ id: movie.id, title: movie.title, original_language: movie.original_language, image: `https://image.tmdb.org/t/p/original/${image.data.backdrops[0].file_path}`, overview: movie.overview, date: parseInt(movie.release_date), rating: movie.vote_average });
  //       if (result.length === popularMovies.data.results.length) resolve(result);
  //     });
  //   });
  // }, []);
  return (
    <DataContext.Provider
      value={{
        Lang,
        setLang,
        Languages,
        Validator,
        width,
        history,
        GetMovies,
        ref,
        cache
      }}>
      {props.children}
    </DataContext.Provider>
  );
}
