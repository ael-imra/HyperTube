const express = require('express')
const { countWatchedMovies, lastWatchedMovies, countUserWatchedMovies, watchedMovies } = require(__dirname + '/../controllers/watchedMovieController')
const watchedMovieRoute = express.Router()

watchedMovieRoute.get('/count/:userName', countUserWatchedMovies)
watchedMovieRoute.get('/lastWatched/:userName', lastWatchedMovies)
watchedMovieRoute.get('/lastWatched', lastWatchedMovies)
watchedMovieRoute.get('/movieCount/:imdbID', countWatchedMovies)
watchedMovieRoute.get('/byUser/:userName', watchedMovies)
watchedMovieRoute.get('/', watchedMovies)

module.exports = watchedMovieRoute
