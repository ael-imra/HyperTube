import React from 'react';
import { GetListMovieFavorite } from '../Assets/GetListMovieFavorite';
import '../Css/FavoriteMovie.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MovieCart } from './MovieCart';
export const FavoriteMovie = () => {
  const [favoriteMovie, setFavoriteMovie] = React.useState('');
  React.useEffect(() => {
    const dataMovies = async () => {
      const test = await GetListMovieFavorite();
      setFavoriteMovie(test);
    };
    dataMovies();
  }, []);
  console.log(favoriteMovie);
  return <div className='Favorite'>{favoriteMovie instanceof Array ? favoriteMovie.map((movie, key) => <MovieCart movie={movie} key={key} />) : <CircularProgress color='secondary' />}</div>;
};
