import React from 'react';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Button from '@material-ui/core/Button';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Rating from '@material-ui/lab/Rating';
import '../Css/Slider.css';

export default function Slider(props) {
  const [sliderActive, setSliderActive] = React.useState(0);
  return (
    <div className='Slide'>
      {sliderActive !== 0 ? (
        <NavigateBeforeIcon
          onClick={() => {
            setSliderActive(sliderActive === 0 ? props.list.length - 1 : sliderActive - 1);
          }}
          style={{ fontSize: '55px', cursor: 'pointer', position: 'absolute', left: '25px', zIndex: '1', color: 'white' }}
        />
      ) : (
        ''
      )}

      {props.list.map((movie, key) => (
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
                style={{
                  backgroundColor: '#ec4646',
                  color: 'white',
                  textTransform: 'none',
                  width: '180px',
                  fontSize: '18px',
                  marginTop: '15px',
                }}>
                Watch
              </Button>
              <Button
                variant='contained'
                startIcon={<PlaylistAddIcon style={{ fontSize: '35px' }} />}
                style={{
                  backgroundColor: 'rgba(34, 40, 49, 0.86)',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '18px',
                  width: '180px',
                  marginTop: '15px',
                }}>
                Add to list
              </Button>
            </div>
          </div>
          {/* <div className='shadow' style={{ boxShadow: 'rgba(0, 0, 0, 0.88) 0px 24px 90px 52px inset, inset 0px 66px 56px -16px rgba(0,0,0,1)' }}></div> */}
        </div>
      ))}
      {sliderActive !== props.list.length - 1 ? (
        <NavigateNextIcon
          onClick={() => {
            setSliderActive(sliderActive === props.list.length - 1 ? 0 : sliderActive + 1);
          }}
          style={{ fontSize: '55px', cursor: 'pointer', position: 'absolute', right: '25px', zIndex: '1', color: 'white' }}
        />
      ) : (
        ''
      )}
      {/* <div className='ok'>
        {props.list.map((src, key) => (
          <div key={key} className={`Box ${key === sliderActive ? 'BoxActive' : ''}`}></div>
        ))}
      </div> */}
    </div>
  );
}
