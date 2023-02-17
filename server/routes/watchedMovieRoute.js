const express = require('express')
const { lastWatchedMovies, countUserWatchedMovies } = require(__dirname + '/../controllers/watchedMovieController')
const watchedMovieRoute = express.Router()

watchedMovieRoute.get('/countUserWatchedMovies/:userName', countUserWatchedMovies)
watchedMovieRoute.get('/lastWatchedMovies/:userName', lastWatchedMovies)

module.exports = watchedMovieRoute
