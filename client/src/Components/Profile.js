import React from 'react';
import '../Css/Profile.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { InformationUser } from './InformationUser';
import { UpdateInfoUser } from './UpdateInfoUser';
import { UpdatePassword } from './UpdatePassword';
import { GetUserInfo } from '../Assets/GetInfoUser';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import { DataContext } from '../Context/AppContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';

export const Profile = () => {
  const [actionProfile, setActionProfile] = React.useState(0);
  const ctx = React.useContext(DataContext);
  const [userInfo, setUserInfo] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    fixFirstName: '',
    fixLastName: '',
    fixEmailName: '',
    fixUserName: '',
    middleware: false,
  });

  const [contentMessage, setContentMessage] = React.useState({ type: '', content: '', state: false });
  const handleCloseMessage = () => {
    setContentMessage({ type: 'info', content: '', state: false });
  };
  React.useEffect(() => {
    async function awaitData() {
      const data = await GetUserInfo();
      setUserInfo({ ...data, middleware: true, fixFirstName: data.firstName, fixLastName: data.lastName, fixEmailName: data.email, fixUserName: data.userName });
    }
    awaitData();
  }, []);

  return (
    <div className='Profile'>
      {userInfo.middleware ? (
        <>
          <div className='detailUser'>
            <div className='UserInfo'>
              {userInfo.image ? <img src={userInfo.image} /> : <Avatar style={{ width: '250px', height: '250px', marginTop: '15px', fontSize: '90px', backgroundColor: 'rgb(236, 70, 70)' }}>H</Avatar>}

              <p>{userInfo.fixUserName}</p>
              <p>{userInfo.fixEmailName}</p>
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
                <Tabs variant='scrollable' value={actionProfile} onChange={(event, newValue) => setActionProfile(newValue)}>
                  <Tab label='Information' />
                  <Tab label='Update Information' />
                  <Tab label='Update Password' />
                </Tabs>
              </AppBar>
              {actionProfile === 0 ? (
                <InformationUser UserInfo={{ firstName: userInfo.fixFirstName, lastName: userInfo.fixLastName, userName: userInfo.fixUserName, email: userInfo.fixEmailName }} />
              ) : actionProfile === 1 ? (
                <UpdateInfoUser setUserInfo={setUserInfo} userInfo={userInfo} setContentMessage={setContentMessage} />
              ) : (
                <UpdatePassword />
              )}
            </div>
          </div>
          <div className='MoviesWatch'>
            <p>Last watch</p>
            {console.log(ctx.cache.listMovies.list)}
          </div>
        </>
      ) : (
        <CircularProgress color='secondary' />
      )}

      {contentMessage.type !== 'info' ? (
        <Snackbar open={contentMessage.state} autoHideDuration={5000} onClose={handleCloseMessage}>
          <Alert severity={contentMessage.type} onClose={handleCloseMessage} variant='filled'>
            {contentMessage.content}
          </Alert>
        </Snackbar>
      ) : (
        ''
      )}
    </div>
  );
};
