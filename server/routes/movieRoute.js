const express = require('express')
const { getOneMovie, countWatchedMovies, lastWatchedMovies, countUserWatchedMovie } = require('../controllers/movieController')
const movieRoute = express.Router()

movieRoute.get('/count/:imdbID/:userName', countUserWatchedMovie)
movieRoute.get('/lastWatched', lastWatchedMovies)
movieRoute.get('/:imdbID/:torrentHash', getOneMovie)
movieRoute.get('/:imdbID', countWatchedMovies)

module.exports = movieRoute
