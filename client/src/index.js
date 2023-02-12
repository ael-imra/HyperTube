import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import Axios from 'axios';

Axios.defaults.baseURL = process.env.REACT_APP_SERVER_HOST;

ReactDOM.render(<App />, document.getElementById('root'));
