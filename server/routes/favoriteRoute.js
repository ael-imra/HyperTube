const express = require('express');
const { getAllFavorites, removeFavorite, addFavorite } = require('../controllers/favoriteController');
const favoriteRoute = express.Router();

favoriteRoute.get('/:justImdbID', getAllFavorites);
favoriteRoute.get('/', getAllFavorites);
favoriteRoute.post('/delete', removeFavorite);
favoriteRoute.post('/', addFavorite);

module.exports = favoriteRoute;
