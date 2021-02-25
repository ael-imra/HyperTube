import React from 'react';
import Slider from './Slider';
import '../Css/Dashboard.css';
import ListMovies from './ListMovies';
import SortAndFilter from './SortAndFilter';

export default function Dashboard() {
  return (
    <>
      <Slider />
      <SortAndFilter />
      <ListMovies />
    </>
  );
}
