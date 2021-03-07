const { getMovie, getCountWatchedMovie, getLastWatchedMovie } = require('../models/movieModel')
const { stream } = require('./streamController')

const getOneMovie = async function (req, res, next) {
	try {
		const { imdbID, torrentHash } = req.params
		if (typeof imdbID !== 'string' || typeof torrentHash !== 'string' || imdbID.length > 10)
			return res.send({
				type: 'error',
				status: 400,
				body: 'Incorrect parameters',
			})
		const movie = await getMovie(imdbID, torrentHash)
		return stream(movie, req, res, next)
	} catch (err) {
		next(err)
	}
}
const countWatchedMovie = async function (req, res, next) {
	try {
		const { imdbID } = req.params
		if (typeof imdbID !== 'string' || imdbID.length > 10)
			return res.send({
				type: 'error',
				status: 400,
				body: 'Incorrect parameters',
			})
		const count = await getCountWatchedMovie(imdbID)
		return res.send({
			type: 'success',
			status: 200,
			body: count,
		})
	} catch (err) {
		next(err)
	}
}
const lastWatchedMovies = async function (req, res, next) {
	try {
		const movies = await getLastWatchedMovie(req.user, 10)
		if (movies)
			return res.send({
				type: 'success',
				status: 200,
				body: movies,
			})
		return res.send({
			type: 'error',
			status: 403,
			body: 'No movie found',
		})
	} catch (err) {
		next(err)
	}
}
const countWatchedMovies = async function (req, res, next) {
	try {
	} catch (err) {
		next(err)
	}
}
module.exports = {
	getOneMovie,
	countWatchedMovie,
	lastWatchedMovies,
	countWatchedMovies,
}
