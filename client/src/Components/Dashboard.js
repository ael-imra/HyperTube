import React from 'react';
import Slider from './Slider';
import '../Css/Dashboard.css';
import ListMovies from './ListMovies';
import SortAndFilter from './SortAndFilter';
import { Switch, Route, useHistory } from 'react-router-dom';
import { MovieDetail } from './MovieDetail';
import { FavoriteMovie } from './FavoriteMovie';
import { Profile } from './Profile';
import { Users } from './Users';
export const NotFound = () => {
    const history = useHistory();
    React.useEffect(() => {
        history.push('/');
    }, []);
    return <div></div>;
};
export default function Dashboard() {
    return (
        <>
            <Switch>
                <Route exact path='/'>
                    <Slider />
                    <SortAndFilter />
                    <ListMovies />
                </Route>
                <Route exact path='/movie/:code'>
                    <MovieDetail />
                </Route>
                <Route exact path='/FavoriteMovie'>
                    <FavoriteMovie />
                </Route>
                <Route exact path='/Profile'>
                    <Profile />
                </Route>
                <Route exact path='/Profile/:userName'>
                    <Profile />
                </Route>
                <Route exact path='/Users'>
                    <Users />
                </Route>
                <Route path='*'>
                    <NotFound />
                </Route>
            </Switch>
        </>
    );
}
