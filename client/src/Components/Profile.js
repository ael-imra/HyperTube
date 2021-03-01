import React from 'react';
import '../Css/Profile.css';
import image from '../Images/large_sel-hamr.jpg';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

export const Profile = () => {
  return (
    <div className='Profile'>
      <div className='detailUser'>
        <div className='UserInfo'>
          <img src={image} />
          <p>sel-hamr</p>
          <p>soufiane.hamri07@gmail.com</p>
          <div className='CountWatchAndFavorite'>
            <div>
              <p>100</p>
              <p>{`Watch`}</p>
            </div>
            <div></div>
            <div>
              <p>10</p>
              <p>Favorite</p>
            </div>
          </div>
        </div>
        <div className='ActionInfo'>
          <AppBar style={{ backgroundColor: '#222831', height: '48px' }} position='static'>
            <Tabs variant='scrollable' value={0}>
              <Tab label='Information' />
              <Tab label='Update Information' />
              <Tab label='Update Password' />
            </Tabs>
          </AppBar>
        </div>
      </div>
      <div className='MoviesWatch'></div>
    </div>
  );
};
