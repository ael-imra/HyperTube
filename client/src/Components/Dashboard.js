import React from 'react';
import Button from '@material-ui/core/Button';
import { DataContext } from '../Context/AppContext';
import Slider from './Slider';
import MovieIcon from '@material-ui/icons/Movie';
import Axios from 'axios';
import '../Css/Dashboard.css';
import ListMovies from './ListMovies';
import Search from './Search';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const SortAndFilter = () => {
  const ctx = React.useContext(DataContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filter, setFilter] = React.useState(ctx.cache.filter);
  const ArrayYears = () => {
    const listYears = [];
    for (let i = 1; i <= 61; i++) listYears.push(i + 1959);
    return listYears;
  };
  const listFilter = {
    genre: [
      'All',
      'Action',
      'Adventure',
      'Animation',
      'Biography',
      'Comedy',
      'Crime',
      'Documentary',
      'Drama',
      'Family',
      'Fantasy',
      'Film-Noir',
      'Game-Show',
      'History',
      'Horror',
      'Music',
      'Musical',
      'Mystery',
      'News',
      'Reality-TV',
      'Romance',
      'Sci-Fi',
      'Sport',
      'Talk-Show',
      'Thriller',
      'War',
      'Western',
    ],
    rating: [0, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    order: ['year', 'rating', 'title'],
    years: ArrayYears(),
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const selectFilter = (type, value) => {
    if (type === 'years') setFilter((oldValue) => ({ ...oldValue, years: value }));
    if (type === 'genre') setFilter((oldValue) => ({ ...oldValue, genre: value }));
    if (type === 'rating') setFilter((oldValue) => ({ ...oldValue, rating: value }));
    if (type === 'order') setFilter((oldValue) => ({ ...oldValue, order: value }));
    ctx.cache.filter = filter;
    handleClose();
  };
  const search = async () => {
    if (ctx.ref.setListMovies) ctx.ref.setListMovies({ list: [], page: 0, next: true, middleware: true });
    ctx.cache.listMovies = await ctx.GetMovies(1, [], filter);
    if (ctx.ref.setListMovies) ctx.ref.setListMovies(ctx.cache.listMovies);
  };
  return (
    <div className='SortAndFilter'>
      <div>
        <Search
          Onchange={(value) => {
            setFilter((oldValue) => ({ ...oldValue, title: value }));
            ctx.cache.filter = filter;
          }}
        />
        <Button
          variant='contained'
          size='large'
          onClick={search}
          startIcon={<FindReplaceIcon style={{ fontSize: '35px' }} />}
          style={{
            backgroundColor: '#ec4646',
            color: 'white',
            textTransform: 'none',
            width: '180px',
            fontSize: '18px',
          }}>
          Search
        </Button>
      </div>
      <div>
        {/* <div className='q'>
          <p>Years</p>
          <div onClick={handleClick} data-filter='years'>
            <p>{filter.years !== '' ? filter.years : 'All'}</p>
            <ExpandMoreIcon />
          </div>
        </div> */}
        <div className='q'>
          <p>Genre</p>
          <div onClick={handleClick} data-filter='genre'>
            <p>{filter.genre !== '' ? filter.genre : 'All'}</p>
            <ExpandMoreIcon />
          </div>
        </div>
        <div className='q'>
          <p>Rating</p>
          <div onClick={handleClick} data-filter='rating'>
            <p>{filter.rating !== 0 ? `+ ${filter.rating}` : 'All'}</p>
            <ExpandMoreIcon />
          </div>
        </div>
        <div className='q'>
          <p>Order By</p>
          <div onClick={handleClick} data-filter='order'>
            <p>{filter.order !== '' ? filter.order : 'All'}</p>
            <ExpandMoreIcon />
          </div>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: '460px',
            width: '160px',
          },
        }}>
        {anchorEl
          ? listFilter[anchorEl.getAttribute('data-filter')].map((item, key) => (
              <MenuItem onClick={() => selectFilter(anchorEl.getAttribute('data-filter'), item)} key={key}>
                {anchorEl.getAttribute('data-filter') === 'rating' ? `+ ${item}` : item}
              </MenuItem>
            ))
          : ''}
      </Menu>
    </div>
  );
};
export default function Dashboard() {
  const ctx = React.useContext(DataContext);
  const [listPopularMovies, setListPopularMovies] = React.useState([]);
  console.log('Dashboard');

  return (
    <>
      <Slider list={listPopularMovies} />
      <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '15px', marginLeft: '55px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MovieIcon style={{ fontSize: '50px', color: 'white' }} />
          <p style={{ color: 'white', fontSize: '28px', margin: '0', marginLeft: '10px' }}>Movies</p>
        </div>
        <SortAndFilter />
      </div>
      <ListMovies />
    </>
  );
}
