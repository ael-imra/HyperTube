import '../Css/App.css';
import React from 'react';
import '../Css/Library.css';
import '../Css/RegisterAndSingIn.css';
import Intro from './Intro';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppContext, { DataContext } from '../Context/AppContext';
import SingIn from './SingIn';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Header from './Header';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import ResetPassword from './ResetPassword';
import Dashboard from './Dashboard';

function App() {
  const [snackbarToggle, setSnackbarToggle] = React.useState(false);
  const [contentMessage, setContentMessage] = React.useState({ type: '', content: '' });
  const [search, setSearch] = React.useState('');
  const ctx = React.useContext(DataContext);
  const handleCloseMessage = () => {
    setSnackbarToggle(false);
  };
  console.log('App');
  return (
    <div
      className='App'
      style={{ overflowY: 'auto' }}
      onScroll={async (e) => {
        if (e.target.scrollTop + e.target.clientHeight + 450 > e.target.scrollHeight) {
          if (ctx.ref.setListMovies) {
            ctx.cache.listMovies = { list: await ctx.GetMovies(ctx.cache.listMovies.page, ctx.cache.listMovies.list, search), page: ctx.cache.listMovies.page + 1, next: true };
            ctx.ref.setListMovies(ctx.cache.listMovies);
          }
        }
        if (e.target.scrollTop >= 750) document.querySelector('.Header').style.backgroundColor = 'rgba(34, 40, 49, 0.78)';
        else document.querySelector('.Header').style.backgroundColor = 'rgba(34, 40, 49, 0.46)';
      }}>
      {/* <Header type='notLogin' />
      <div className='Body'>
        <>
          <Switch>
            <Route exact path='/'>
              <Intro />
            </Route>
            <Route exact path='/Login'>
              <SingIn
                handleShowMessage={(type, content) => {
                  setContentMessage({ type: type, content: content });
                  setSnackbarToggle(true);
                }}
              />
            </Route>
            <Route exact path='/Register'>
              <Register
                handleShowMessage={(type, content) => {
                  setContentMessage({ type: type, content: content });
                  setSnackbarToggle(true);
                }}
              />
            </Route>
            <Route exact path='/ForgotPassword'>
              <ForgotPassword
                handleShowMessage={(type, content) => {
                  setContentMessage({ type: type, content: content });
                  setSnackbarToggle(true);
                }}
              />
            </Route>
            <Route exact path='/ResetPassword/:token'>
              <ResetPassword
                handleShowMessage={(type, content) => {
                  setContentMessage({ type: type, content: content });
                  setSnackbarToggle(true);
                }}
              />
            </Route>
          </Switch>
          <Snackbar open={snackbarToggle} autoHideDuration={5000} onClose={handleCloseMessage}>
            <Alert severity={contentMessage.type} onClose={handleCloseMessage} variant='filled' style={{ backgroundColor: '#ec4646' }}>
              {contentMessage.content}
            </Alert>
          </Snackbar>
        </>
      </div> */}
      <Header type='Login' search={{ search, setSearch }} />
      <Dashboard />
    </div>
  );
}

function AppContainer() {
  return (
    <Router>
      <AppContext>
        <Switch>
          <Route>
            <App />
          </Route>
        </Switch>
      </AppContext>
    </Router>
  );
}
export default AppContainer;
