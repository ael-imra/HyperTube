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
    listMovies: { list: [], page: 0, next: false, middleware: true },
    listPopularMovies: {},
    filter: { years: '', rating: 0, title: '', order: '', genre: '' },
  };
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
        cache,
      }}>
      {props.children}
    </DataContext.Provider>
  );
}
