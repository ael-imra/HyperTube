import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import StarIcon from '@material-ui/icons/Star';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { DataContext } from '../Context/AppContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../Css/ListMovies.css';

export default function ListMovies() {
  const ctx = React.useContext(DataContext);
  const [listMovies, setListMovies] = React.useState(ctx.cache.listMovies);
  React.useEffect(async () => {
    ctx.cache.listMovies = await ctx.GetMovies(1, [], ctx.cache.filter);
    ctx.ref.setListMovies = setListMovies;
    setListMovies(ctx.cache.listMovies);
  }, []);
  console.log('ListMovie');
  return (
    <div className='ListMovie'>
      {listMovies.middleware ? (
        <CircularProgress style={{ marginTop: '35px' }} />
      ) : (
        <>
          {listMovies.list.map((movie, key) => (
            <div className='PostMovie' key={key}>
              <div className='movieImage'>
                <img src={movie.image} alt='movie' />
                <div className='moreInfoMovie'>
                  <p style={{ color: 'white', padding: '6px', border: '1px solid white', position: 'absolute', top: '10px', right: '10px', borderRadius: '8px', fontSize: '15px' }}>{movie.language.toUpperCase()}</p>
                  <p style={{ color: 'white', fontSize: '15px', marginLeft: '15px', marginRight: '15px', marginBottom: '5px', marginTop: '35px' }}>{`gender : ${movie.genres.toString()}`}</p>
                  <Divider style={{ backgroundColor: '#e8eae6', width: '90%', marginTop: '15px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', height: '0.3px' }} />
                  <p style={{ color: 'white', fontSize: '16px', overflow: 'auto', maxHeight: '200px', marginLeft: '15px', marginRight: '15px', maxHeight: '180px' }}>{movie.description}</p>
                  <div style={{ width: '100%', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <Button
                      variant='contained'
                      startIcon={<PlayArrowIcon style={{ fontSize: '25px' }} />}
                      style={{
                        backgroundColor: '#ec4646',
                        color: 'white',
                        textTransform: 'none',
                        fontSize: '12px',
                      }}>
                      Watch
                    </Button>
                    <Button
                      variant='contained'
                      startIcon={<PlaylistAddIcon style={{ fontSize: '25px' }} />}
                      style={{
                        backgroundColor: 'rgba(34, 40, 49, 0.86)',
                        color: 'white',
                        textTransform: 'none',
                        fontSize: '12px',
                      }}>
                      Add to list
                    </Button>
                  </div>
                </div>
              </div>
              <p>{movie.titre}</p>
              <div>
                <p>{movie.year}</p>
                <p>{movie.runtime} Min</p>
                <Divider orientation='vertical' style={{ height: '14px', backgroundColor: '#6b6b6b' }} />
                <div className='PostRating'>
                  <StarIcon style={{ color: '#ffb400', fontSize: '20px', marginRight: '5px' }} /> <p style={{ color: '#ffb400', fontSize: '14px', margin: '0px' }}>{movie.rating}</p>
                </div>
                <VisibilityIcon style={{ color: '#ec4646', fontSize: '17px', marginRight: '5px' }} />
              </div>
            </div>
          ))}
          {ctx.cache.listMovies.next ? <LinearProgress color='secondary' style={{ position: 'absolute', bottom: '0px', width: '100%' }} /> : ''}
        </>
      )}
    </div>
  );
}
