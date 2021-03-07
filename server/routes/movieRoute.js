const express = require('express')
const { getOneMovie, countWatchedMovie } = require('../controllers/movieController')
const movieRoute = express.Router()

movieRoute.get('/:imdbID/:torrentHash', getOneMovie)
movieRoute.get('/:imdbID', countWatchedMovie)

module.exports = movieRoute
