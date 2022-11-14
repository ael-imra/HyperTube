import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import Axios from 'axios';
import { HOST } from './constants';
Axios.defaults.baseURL = HOST;

ReactDOM.render(<App />, document.getElementById('root'));
