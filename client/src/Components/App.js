import '../Css/App.css';
import React from 'react';
import '../Css/Library.css';
import '../Css/RegisterAndSingIn.css';
import Intro from './Intro';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import AppContext, { DataContext } from '../Context/AppContext';
import SingIn from './SingIn';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Header from './Header';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import ResetPassword from './ResetPassword';
import Dashboard from './Dashboard';
import Axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { NotFound } from './Dashboard';
import { IntroSuccessOrFailed } from './IntroSuccessOrFailed';

function App() {
    const [snackbarToggle, setSnackbarToggle] = React.useState(false);
    const [contentMessage, setContentMessage] = React.useState({ type: '', content: '' });
    const [isLogin, setIsLogin] = React.useState('');
    const [search, setSearch] = React.useState('');
    const ctx = React.useContext(DataContext);
    const location = useLocation();
    const handleCloseMessage = () => {
        setSnackbarToggle(false);
    };
    React.useEffect(async () => {
        let unmount = false;
        const result = await Axios.get('/auth', { withCredentials: true });
        if (!unmount) setIsLogin(result.data.isLogin);
        return () => (unmount = true);
    }, [ctx.Lang]);
    return isLogin === '' ? (
        <CircularProgress color='secondary' />
    ) : isLogin === true ? (
        <div
            className='App'
            style={{ overflowY: 'auto' }}
            onScroll={async (e) => {
                if (e.target.scrollTop + e.target.clientHeight + 450 > e.target.scrollHeight && e.target.scrollTop > 800) {
                    if (ctx.ref.setListMovies && ctx.cache.listMovies.list.length !== 0 && location.pathname === '/') {
                        if (ctx.cache.listMovies.next && ctx.cache.listMoviesLoader === false) {
                            ctx.cache.listMoviesLoader = true;
                            ctx.cache.listMovies = await ctx.GetMovies(ctx.cache.listMovies.page, ctx.cache.listMovies.list, ctx.cache.filter);
                            if (ctx.ref.setListMovies) ctx.ref.setListMovies(ctx.cache.listMovies);
                            ctx.cache.listMoviesLoader = false;
                        }
                    }
                }
                if (e.target.scrollTop >= 750) document.querySelector('.Header').style.backgroundColor = 'rgba(34, 40, 49, 0.78)';
                else document.querySelector('.Header').style.backgroundColor = 'rgba(34, 40, 49, 0.46)';
            }}>
            <Header type='Login' search={{ search, setSearch }} setIsLogin={setIsLogin} />
            <Dashboard />
        </div>
    ) : (
        <div className='App' style={{ overflowY: 'auto' }}>
            <Header type='notLogin' />
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
                                setIsLogin={setIsLogin}
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
                        <Route exact path='/success'>
                            <IntroSuccessOrFailed type='success' />
                        </Route>
                        <Route exact path='/failed'>
                            <IntroSuccessOrFailed type='failed' />
                        </Route>
                        <Route exact path='/ResetPassword/:token'>
                            <ResetPassword
                                handleShowMessage={(type, content) => {
                                    setContentMessage({ type: type, content: content });
                                    setSnackbarToggle(true);
                                }}
                            />
                        </Route>
                        <Route path='*'>
                            <NotFound />
                        </Route>
                    </Switch>
                    <Snackbar open={snackbarToggle} autoHideDuration={5000} onClose={handleCloseMessage}>
                        <Alert severity={contentMessage.type} onClose={handleCloseMessage} variant='filled'>
                            {contentMessage.content}
                        </Alert>
                    </Snackbar>
                </>
            </div>
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
