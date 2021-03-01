import React from 'react';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Button from '@material-ui/core/Button';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Rating from '@material-ui/lab/Rating';
import '../Css/Slider.css';
import Axios from 'axios';
import { UseWindowSize } from '../Assets/UseWindowSize';
import { DataContext } from '../Context/AppContext';
import { useHistory } from 'react-router-dom';

export default function Slider() {
  const width = UseWindowSize();
  const ctx = React.useContext(DataContext);
  const [sliderActive, setSliderActive] = React.useState(0);
  const [listPopularMovies, setListPopularMovies] = React.useState([]);
  let history = useHistory();
  React.useEffect(async () => {
    let unmount = false;
    const popularMovies = await Axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=7a518fe1d1c5359a4929ef4765c347fb`);
    const detailPopularMovies = await new Promise((resolve) => {
      const result = [];
      popularMovies.data.results.map(async (movie) => {
        const image = await Axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=7a518fe1d1c5359a4929ef4765c347fb`);
        image.data.backdrops.sort((a, b) => b.width - a.width);
        result.push({ id: movie.id, title: movie.title, original_language: movie.original_language, image: `https://image.tmdb.org/t/p/original/${image.data.backdrops[0].file_path}`, overview: movie.overview, date: parseInt(movie.release_date), rating: movie.vote_average });
        if (result.length === popularMovies.data.results.length) resolve(result);
      });
    });
    console.log(listPopularMovies);
    if (!unmount) setListPopularMovies(detailPopularMovies);
    return () => (unmount = true);
  }, []);
  return width > 600 ? (
    <div className='Slide'>
      {sliderActive !== 0 ? (
        <NavigateBeforeIcon
          onClick={() => {
            setSliderActive(sliderActive === 0 ? listPopularMovies.length - 1 : sliderActive - 1);
          }}
          style={{ fontSize: '55px', cursor: 'pointer', position: 'absolute', left: '25px', zIndex: '1', color: 'white' }}
        />
      ) : (
        ''
      )}

      {listPopularMovies.map((movie, key) => (
        <div className={`${key === sliderActive ? 'BoxSlider SliderActive' : 'BoxSlider SlideNoActive'}`} key={key}>
          <img src={movie.image} />
          <div className='detail'>
            <p>{movie.title}</p>
            <div className='Rating'>
              <Rating name='read-only' value={movie.rating / 2} max={5} precision={0.1} readOnly size='large' />
              <p>{movie.date}</p>
              <p>{movie.original_language}</p>
            </div>
            <p>{movie.overview}</p>
            <div className='SliderAction'>
              <Button
                variant='contained'
                startIcon={<PlayArrowIcon style={{ fontSize: '35px' }} />}
                onClick={async () => {
                  const getImdbCode = await Axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/external_ids?api_key=7a518fe1d1c5359a4929ef4765c347fb`);
                  // const codeMovie = await Axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${getImdbCode.data.imdb_id}`);
                  history.push(`/movie/${getImdbCode.data.imdb_id}`);
                }}
                style={{
                  backgroundColor: '#ec4646',
                  color: 'white',
                  textTransform: 'none',
                  width: '180px',
                  fontSize: '18px',
                  marginTop: '15px',
                }}>
                {ctx.Languages[ctx.Lang].Watch}
              </Button>
              <Button
                variant='contained'
                startIcon={<PlaylistAddIcon style={{ fontSize: '35px' }} />}
                style={{
                  backgroundColor: 'rgba(34, 40, 49, 0.86)',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '18px',
                  minWidth: '180px',
                  marginTop: '15px',
                }}>
                {ctx.Languages[ctx.Lang].AddToList}
              </Button>
            </div>
          </div>
        </div>
      ))}
      {sliderActive !== listPopularMovies.length - 1 ? (
        <NavigateNextIcon
          onClick={() => {
            setSliderActive(sliderActive === listPopularMovies.length - 1 ? 0 : sliderActive + 1);
          }}
          style={{ fontSize: '55px', cursor: 'pointer', position: 'absolute', right: '25px', zIndex: '1', color: 'white' }}
        />
      ) : (
        ''
      )}
    </div>
  ) : (
    ''
  );
}
