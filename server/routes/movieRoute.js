const express = require('express')
const { getOneMovie, countWatchedMovies, lastWatchedMovies } = require('../controllers/movieController')
const movieRoute = express.Router()

movieRoute.get('/lastWatched', lastWatchedMovies)
movieRoute.get('/:imdbID/:torrentHash', getOneMovie)
movieRoute.get('/:imdbID', countWatchedMovies)

module.exports = movieRoute
