const express = require('express')
const { getOneMovie, getMovieInfo, getMoviesInfo } = require('../controllers/movieController')
const movieRoute = express.Router()

movieRoute.get('/:imdbID/:torrentHash', getOneMovie)
movieRoute.get('/:imdbID', getMovieInfo)
movieRoute.get('/', getMoviesInfo)

module.exports = movieRoute
