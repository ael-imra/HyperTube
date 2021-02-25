const express = require('express')
const { getAllFavorites, removeFavorite, addFavorite } = require('../controllers/favoriteController')
const favoriteRoute = express.Router()

favoriteRoute.get('/', getAllFavorites)
favoriteRoute.delete('/', removeFavorite)
favoriteRoute.post('/', addFavorite)

module.exports = favoriteRoute
