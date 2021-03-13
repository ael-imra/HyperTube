import React from "react";
import { GetListMovieFavorite } from "../Assets/GetListMovieFavorite";
import "../Css/FavoriteMovie.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MovieCart } from "./MovieCart";
import { DataContext } from "../Context/AppContext";
import noData from "../Images/no-data.svg";
export const FavoriteMovie = () => {
  const [favoriteMovie, setFavoriteMovie] = React.useState(false);
  const ctx = React.useContext(DataContext);
  React.useEffect(() => {
    let unmount = false;
    const dataMovies = async () => {
      const moviesFavorite = await GetListMovieFavorite();
      if (!unmount) setFavoriteMovie(moviesFavorite);
    };
    if (!unmount) dataMovies();
    return () => (unmount = true);
  }, []);
  return (
    <div className='Favorite' style={{ height: favoriteMovie instanceof Array ? "auto" : "90%" }}>
      {favoriteMovie ? (
        favoriteMovie instanceof Array ? (
          favoriteMovie.map((movie, key) => <MovieCart movie={movie} key={key} setFavoriteMovie={setFavoriteMovie} />)
        ) : (
          <div className='NoData'>
            <img src={noData} className='ImageNoData' />
            <p>{ctx.Languages[ctx.Lang].NoResult}</p>
          </div>
        )
      ) : (
        <CircularProgress color='secondary' />
      )}
    </div>
  );
};
