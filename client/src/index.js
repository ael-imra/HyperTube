import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import Axios from 'axios';

Axios.defaults.baseURL = process.env.REACT_APP_SERVER_HOST;
if (typeof localStorage !== 'undefined' && localStorage.jwt)
  Axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.jwt}`;

ReactDOM.render(<App />, document.getElementById('root'));
