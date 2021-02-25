const express = require('express')
const { getOneMovie } = require('../controllers/movieController')
const movieRoute = express.Router()

movieRoute.get('/:imdbID/:torrentHash', getOneMovie)

module.exports = movieRoute
