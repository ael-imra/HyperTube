const fs = require('fs')
const path = require('path')
const { keys } = require(__dirname + '/../configs/indexConfig')
const axios = require('axios')
const { getUnwatchedMovie, deleteMovies } = require('../models/movieModel')
const deleteMoviesNotWatched = async function () {
	const movies = await getUnwatchedMovie()
	for (movie of movies) {
		deleteMovies()
		const moviePath = path.join(__dirname, '../downloads/videos/', movie.moviePath)
		if (fs.existsSync(moviePath)) fs.unlink(moviePath)
	}
}
const getMovieImagesAndCasts = async function (imdbID) {
	try {
		const images = await axios.get(`https://api.themoviedb.org/3/movie/${imdbID}/images?api_key=${keys.themoviedb}`)
		const credits = await axios.get(`https://api.themoviedb.org/3/movie/${imdbID}/credits?api_key=${keys.themoviedb}`)
		credits.data.cast = credits.data.cast.map((cst) => ({
			name: cst.name,
			character_name: cst.character,
			url_small_image: cst.profile_path ? `https://image.tmdb.org/t/p/original/${cst.profile_path}` : null,
			imdb_code: cst.id,
		}))
		credits.data.cast.length = credits.data.cast.length > 5 ? 5 : credits.data.cast.length
		images.data.backdrops.sort((a, b) => b.width - a.width)
		return { images, credits }
	} catch (err) {
		return { images: null, credits: null }
	}
}
const getMovieInfo = async function (imdbID) {
	try {
		const movie = await axios.get(`https://api.themoviedb.org/3/movie/${imdbID}?api_key=${keys.themoviedb}`)
		return movie.data
	} catch (err) {
		return {}
	}
}
module.exports = {
	getMovieImagesAndCasts,
	getMovieInfo,
	deleteMoviesNotWatched,
}
