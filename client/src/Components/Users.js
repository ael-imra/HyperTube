import React, { useState, useEffect, useRef } from 'react';
import '../Css/Users.css';
import Button from '@material-ui/core/Button';
import Search from './Search';
import { DataContext } from '../Context/AppContext';
import FindReplaceIcon from '@material-ui/icons/FilterList';
import axios from 'axios';
import noData from '../Images/no-data.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';

export function Users() {
    const ctx = React.useContext(DataContext);
    const [users, changeUsers] = useState([]);
    const [display, changeDisplay] = useState('none');
    const [search, changeSearch] = useState('');
    const [nextUsers, changeNext] = useState(25);
    const history = useHistory();
    const Ref = useRef();

    async function getData() {
        changeDisplay('block');
        await axios.get(`http://localhost:1337/profile/allProfiles/${search}?offSet=0`, { withCredentials: true }).then((res) => {
            changeUsers(res.data.body);
            changeDisplay('none');
        });
    }
    async function scroll() {
        const { scrollHeight, scrollTop, offsetHeight } = Ref.current;
        if (users[users.length - 1] !== 'noMoreData') {
            if (offsetHeight + scrollTop + 300 > scrollHeight) {
                changeDisplay('block');
                await axios.get(`http://localhost:1337/profile/allProfiles/${search}?offSet=${nextUsers}`, { withCredentials: true }).then((res) => {
                    let newArray = [];
                    newArray.push(...users, res.data.body[0]);
                    changeUsers(newArray);
                    changeDisplay('none');
                    changeNext(nextUsers + 25);
                });
            }
        }
    }
    useEffect(() => {
        let unmount = false;
        async function leakLix() {
            changeDisplay('block');
            await axios.get(`http://localhost:1337/profile/allProfiles?offSet=0`, { withCredentials: true }).then((res) => {
                if (!unmount) {
                    changeUsers(res.data.body);
                    changeDisplay('none');
                }
            });
        }
        if (!unmount) leakLix();
        return () => (unmount = true); // eslint-disable-next-line
    }, []);
    return (
        <div style={{ display: 'flex', flexFlow: 'column', marginTop: '50px' }}>
            <div className='searchUsers'>
                <Search
                    Onchange={(str) => {
                        changeSearch(str);
                    }}
                />
                <Button
                    id='search'
                    variant='contained'
                    size='large'
                    startIcon={<FindReplaceIcon style={{ fontSize: '25px' }} />}
                    style={{
                        backgroundColor: '#ec4646',
                        color: 'white',
                        textTransform: 'none',
                        width: '11%',
                        maxWidth: '120px',
                        minWidth: '100px',
                        fontSize: '13px',
                        height: '45px',
                    }}
                    onClick={getData}>
                    {ctx.Languages[ctx.Lang].Search}
                </Button>
            </div>
            <div className='userParent' id='test' onScroll={scroll} ref={Ref}>
                {users[0] !== 'noMoreData' ? (
                    users.map((value, key) =>
                        value !== 'noMoreData' ? (
                            <div className='user Fhover' key={key} onClick={() => history.push(`/profile/${value.userName}`)}>
                                {value.image ? (
                                    <img
                                        className='userImg'
                                        src={
                                            value.image.includes('http://') || value.image.includes('https://') || value.image.includes('data:image/')
                                                ? value.image
                                                : `http://localhost:1337${value.image}`
                                        }
                                    />
                                ) : (
                                    <Avatar style={{ width: '155px', height: '150px', fontSize: '50px', backgroundColor: 'rgb(236, 70, 70)', marginTop: '22px' }}>
                                        {value.userName.substring(0, 2).toUpperCase()}
                                    </Avatar>
                                )}
                                <div className='infoUser'>
                                    <p style={{ color: 'white', margin: '0px', fontSize: '13px', letterSpacing: '0.9px' }}>
                                        <span>{value.firstName + ' '}</span>
                                        <span>{value.lastName}</span>
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <p className='watchFavor'>{`@${value.userName}`}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ''
                        )
                    )
                ) : (
                    <div className='NoData'>
                        <img src={noData} className='ImageNoData' />
                        <p>Ups!... no results found</p>
                    </div>
                )}
            </div>
            <div className='loading' style={{ display: display }}>
                <CircularProgress color='secondary' style={{ width: '70px', height: '70px', position: 'absolute', top: '23%', left: '45%' }} />
            </div>
        </div>
    );
}
