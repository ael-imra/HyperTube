import React from 'react';
import { DataContext } from '../Context/AppContext';
import '../Css/MovieDetail.css';
import { GetMovie } from '../Assets/GetMovie';
import { useParams } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import VisibilityIcon from '@material-ui/icons/Visibility';
export const MovieDetail = () => {
  let { code } = useParams();
  const ctx = React.useContext(DataContext);
  const [movieInfo, setMovieInfo] = React.useState(ctx.cache.movieInfo);
  console.log(movieInfo);
  React.useEffect(async () => {
    setMovieInfo(await GetMovie(code));
  }, []);
  return (
    <div className='MovieDetail'>
      <div className='movieDetailImage'>
        <img src={movieInfo.coverImage ? movieInfo.coverImage : ''} />
      </div>
      <div className='movieInfo'>
        <div>
          <p>{movieInfo.titleLong}</p>
          <p>imdb {movieInfo.rating}</p>
          <p>{movieInfo.language}</p>
        </div>
        <Divider style={{ backgroundColor: '#ffffffa3' }} />
        <div>
          <div className='CommentAndList'>
            <img src={movieInfo.postImage} alt='...' />
            <Button
              startIcon={<AddIcon style={{ fontSize: '25px' }} />}
              variant='contained'
              size='small'
              style={{
                backgroundColor: '#222831',
                color: 'white',
                textTransform: 'none',
                marginTop: '10px',
                width: '300px',
                height: '40px',
                fontSize: '15px',
                fontWeight: '600',
              }}>
              Add to list
            </Button>
            <Button
              startIcon={<MoreHorizIcon style={{ fontSize: '25px' }} />}
              variant='contained'
              size='small'
              style={{
                backgroundColor: '#222831',
                color: 'white',
                textTransform: 'none',
                marginTop: '10px',
                width: '300px',
                height: '40px',
                fontSize: '15px',
                fontWeight: '600',
              }}>
              show comment
            </Button>
          </div>
          <div className='DetailAndDescription'>
            <div className='DetailAndGallery'>
              <div className='Detail'>
                <p>{movieInfo.title}</p>
                {/* <Divider style={{ backgroundColor: '#ffffffa3', width: '90%' }} /> */}
                <div>
                  <p>{movieInfo.runtime} Min</p>
                  <Divider orientation='vertical' style={{ backgroundColor: '#ffffffa3', height: '70%', marginRight: '10px' }} />
                  <p>{movieInfo.genres ? movieInfo.genres.toString() : ''}</p>
                  <Divider orientation='vertical' style={{ backgroundColor: '#ffffffa3', height: '70%', marginRight: '10px' }} />
                  <p>{movieInfo.year}</p>
                  <Divider orientation='vertical' style={{ backgroundColor: '#ffffffa3', height: '70%', marginRight: '10px' }} />
                  <p style={{ display: 'flex', alignItems: 'center' }}>
                    <VisibilityIcon style={{ fontSize: '15px', marginRight: '5px' }} /> {11}
                  </p>
                </div>
                <Divider style={{ backgroundColor: '#ffffffa3', width: '90%', marginTop: '10px' }} />
                <div className='InfoCast'>
                  <div className='Details'>
                    <p>Details</p>
                    <div>
                      <p>
                        Date uploaded :<span>{movieInfo.dateUploaded}</span>
                      </p>
                      <p>
                        Available in: <span>bluray 720p</span>
                      </p>
                      <p>
                        runtime: <span>{movieInfo.runtime} Min</span>
                      </p>
                      <p>
                        language: <span>{movieInfo.language}</span>
                      </p>
                    </div>
                  </div>
                  <div className='cast'>
                    <p>Cast</p>
                    {movieInfo.cast.map((item, key) => (
                      <div className='CastName' key={key}>
                        <img src={item.url_small_image} alt='...' />
                        <p>{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='Gallery'>
                <p>Gallery</p>
                {movieInfo.codeTrailer ? <iframe width='100%' height='55%' src={`http://www.youtube-nocookie.com/embed/${movieInfo.codeTrailer}`} frameBorder='0' allowFullScreen></iframe> : ''}
                <div className='ScreenshotImage'>
                  {movieInfo.screenshotImage.map((src, key) => (
                    <img src={src} key={key} style={{ width: '33%', objectFit: 'cover', height: '100%' }} />
                  ))}
                </div>
              </div>
            </div>
            <Divider style={{ backgroundColor: '#ffffffa3' }} />
            <div className='Description'>
              <p>Description</p>
              <p>{movieInfo.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
