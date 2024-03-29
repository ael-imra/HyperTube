import React from 'react';
import { DataContext } from '../Context/AppContext';
import '../Css/MovieDetail.css';
import { GetMovie } from '../Assets/GetMovie';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Comments from './Comments';
import MovieIntro from './MovieIntro';
export const MovieDetail = () => {
  let { code } = useParams();
  const ctx = React.useContext(DataContext);
  const [movieInfo, setMovieInfo] = React.useState(ctx.cache.movieInfo);
  const [quality, setQuality] = React.useState(0);

  const HOST = process.env.REACT_APP_SERVER_HOST;

  React.useEffect(() => {
    let unmount = false;
    async function awaitData() {
      ctx.ref.setMovieInfo = setMovieInfo;
      const data = await GetMovie(code);
      if (!unmount) setMovieInfo(data);
    }
    if (!unmount) awaitData();
    return () => (unmount = true);
  }, [code, ctx.Lang]);
  return movieInfo instanceof Object ? (
    <div className="MovieDetail">
      <div className="movieDetailImage">
        {movieInfo.coverImage !== '' ? <img src={movieInfo.coverImage ? movieInfo.coverImage : ''} /> : null}
      </div>
      <MovieIntro data={movieInfo} />
      <div className="Stream">
        <AppBar style={{ backgroundColor: '#222831', height: '48px' }} position="static">
          <Tabs
            value={quality}
            onChange={(event, newValue) => setQuality(newValue)}
            variant="scrollable"
            scrollButtons="on"
          >
            {movieInfo.torrents.map((item, key) => (
              <Tab label={`${item.quality} ${item.type}`} key={key} />
            ))}
          </Tabs>
        </AppBar>
        {movieInfo.torrents.map((movie, key) =>
          quality === key ? (
            <video width="100%" height="700px" controls crossOrigin="use-credentials" key={key}>
              <source src={`${HOST}movie/${movieInfo.imdbCode}/${movie.hash}`} type="video/mp4" />
              <track
                label="English"
                kind="subtitles"
                srcLang="en"
                src={`${HOST}subtitle/${movieInfo.imdbCode}/en`}
                default={ctx.Lang === 'Eng' ? true : false}
              />
              <track
                label="French"
                kind="subtitles"
                srcLang="fr"
                src={`${HOST}subtitle/${movieInfo.imdbCode}/fr`}
                default={ctx.Lang === 'Fr' ? true : false}
              />
            </video>
          ) : (
            ''
          )
        )}
      </div>
      <Comments data={movieInfo} code={code} />
    </div>
  ) : movieInfo === 'not found' ? (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p className="alertNoResult">{ctx.Languages[ctx.Lang].NoResult}</p>
    </div>
  ) : (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress color="secondary" />
    </div>
  );
};
