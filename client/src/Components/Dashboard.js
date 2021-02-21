import React from 'react';
import Button from '@material-ui/core/Button';
import { DataContext } from '../Context/AppContext';
import Slider from './Slider';
import MovieIcon from '@material-ui/icons/Movie';
import Axios from 'axios';

import '../Css/Dashboard.css';

import ListMovies from './ListMovies';

const ListGenre = (props) => {
  let ArrayGender = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller', 'Western'];
  return (
    <div className='genres'>
      {ArrayGender.map((gender, key) => (
        <Button
          key={key}
          variant='contained'
          onClick={(e) => {
            if (props.myListGender.findIndex((gender) => e.target.innerText === gender) === -1) props.setMyListGender([...props.myListGender, e.target.innerText]);
            else props.setMyListGender(props.myListGender.filter((item) => e.target.innerText !== item));
          }}
          style={{
            backgroundColor: `${props.myListGender.findIndex((lgender) => lgender === gender) !== -1 ? '#ec4646' : '#222831'}`,
            color: 'white',
            textTransform: 'none',
            width: '130px',
            fontSize: '16px',
            marginTop: '0px',
            borderRadius: '30px',
            fontWeight: '900',
            padding: '4px',
          }}>
          {gender}
        </Button>
      ))}
    </div>
  );
};
// const ListMovie = (props) => {
//   return (
//     <div className='ListMovie'>
//       {props.ctx.movies.listMovies.list.map((movie, key) => (
//         <div className='PostMovie' key={key}>
//           <div className='movieImage'>
//             <img src={movie.image} alt='movie' />
//             <div className='moreInfoMovie'>
//               <p style={{ color: 'white', padding: '6px', border: '1px solid white', position: 'absolute', top: '10px', right: '10px', borderRadius: '8px', fontSize: '15px' }}>{movie.language.toUpperCase()}</p>
//               <p style={{ color: 'white', fontSize: '15px', marginLeft: '15px', marginRight: '15px', marginBottom: '5px' }}>{`gender : ${movie.genres.toString()}`}</p>
//               <Divider style={{ backgroundColor: '#e8eae6', width: '90%', marginTop: '15px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', height: '0.3px' }} />
//               <p style={{ color: 'white', fontSize: '16px', overflow: 'hidden', maxHeight: '200px', marginLeft: '15px', marginRight: '15px' }}>{movie.description}</p>
//               <div style={{ width: '100%', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
//                 <Button
//                   variant='contained'
//                   startIcon={<PlayArrowIcon style={{ fontSize: '25px' }} />}
//                   style={{
//                     backgroundColor: '#ec4646',
//                     color: 'white',
//                     textTransform: 'none',
//                     fontSize: '12px',
//                   }}>
//                   Watch
//                 </Button>
//                 <Button
//                   variant='contained'
//                   startIcon={<PlaylistAddIcon style={{ fontSize: '25px' }} />}
//                   style={{
//                     backgroundColor: 'rgba(34, 40, 49, 0.86)',
//                     color: 'white',
//                     textTransform: 'none',
//                     fontSize: '12px',
//                   }}>
//                   Add to list
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <p>{movie.titre}</p>
//           <div>
//             <p>{movie.year}</p>
//             <p>{movie.runtime} Min</p>
//             <Divider orientation='vertical' style={{ height: '14px', backgroundColor: '#6b6b6b' }} />
//             <div className='PostRating'>
//               <StarIcon style={{ color: '#ffb400', fontSize: '20px', marginRight: '5px' }} /> <p style={{ color: '#ffb400', fontSize: '14px', margin: '0px' }}>{movie.rating}</p>
//             </div>
//             <VisibilityIcon style={{ color: '#ec4646', fontSize: '17px', marginRight: '5px' }} />
//           </div>
//         </div>
//       ))}
//       <LinearProgress color='secondary' style={{ position: 'absolute', bottom: '0px', width: '100%' }} />
//     </div>
//   );
// };
export default function Dashboard() {
  const ctx = React.useContext(DataContext);
  const [myListGender, setMyListGender] = React.useState(['Drama']);
  const [listPopularMovies, setListPopularMovies] = React.useState([]);
  React.useEffect(async () => {
    const popularMovies = await Axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=7a518fe1d1c5359a4929ef4765c347fb`);
    const detailPopularMovies = await new Promise((resolve) => {
      const result = [];
      popularMovies.data.results.map(async (movie) => {
        const image = await Axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=7a518fe1d1c5359a4929ef4765c347fb`);
        result.push({ id: movie.id, title: movie.title, original_language: movie.original_language, image: `https://image.tmdb.org/t/p/original/${image.data.backdrops[0].file_path}`, overview: movie.overview, date: parseInt(movie.release_date), rating: movie.vote_average });
        if (result.length === popularMovies.data.results.length) resolve(result);
      });
    });
    setListPopularMovies(detailPopularMovies);
  }, []);
  return (
    <>
      <Slider list={listPopularMovies} />
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px', marginLeft: '55px' }}>
        <MovieIcon style={{ fontSize: '50px', color: 'white' }} />
        <p style={{ color: 'white', fontSize: '28px', marginLeft: '10px' }}>Movies</p>
        <ListGenre myListGender={myListGender} setMyListGender={setMyListGender} ctx={ctx} />
      </div>
      {/* <ListMovie ctx={ctx} /> */}
      <ListMovies ctx={ctx} />
    </>
  );
}
