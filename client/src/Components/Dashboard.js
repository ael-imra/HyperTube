import React from 'react';
import Slider from './Slider';
import '../Css/Dashboard.css';
import ListMovies from './ListMovies';
import SortAndFilter from './SortAndFilter';
import { Switch, Route } from 'react-router-dom';
import { MovieDetail } from './MovieDetail';

export default function Dashboard() {
  console.log('Dashboard');
  return (
    <>
      <Switch>
        <Route exact path='/'>
          <Slider />
          <SortAndFilter />
          <ListMovies />
        </Route>
        <Route exact path='/movie/:code'>
          <MovieDetail />
        </Route>
      </Switch>
    </>
  );
}
