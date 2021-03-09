const { getMovie, getCountWatchedMovie, getLastWatchedMovie, getCountUserWatchedMovie } = require('../models/movieModel')
const { stream } = require('./streamController')
const { getUser } = require(__dirname + '/../models/userModel')

const getOneMovie = async function (req, res, next) {
	try {
		const { imdbID, torrentHash } = req.params
		if (typeof imdbID !== 'string' || typeof torrentHash !== 'string' || imdbID.length > 10)
			return res.send({
				type: 'error',
				status: 400,
				body: { Eng: 'Incorrect parameters', Fr: 'Paramètres incorrects' },
			})
		const movie = await getMovie(imdbID, torrentHash)
		return stream(movie, req, res, next)
	} catch (err) {
		next(err)
	}
}
const countWatchedMovies = async function (req, res, next) {
	try {
		const { imdbID } = req.params
		if (typeof imdbID !== 'string' || imdbID.length > 10)
			return res.send({
				type: 'error',
				status: 400,
				body: { Eng: 'Incorrect parameters', Fr: 'Paramètres incorrects' },
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
			body: { Eng: 'No movie found', Fr: 'Aucun film trouvé' },
		})
	} catch (err) {
		next(err)
	}
}
const countUserWatchedMovie = async function (req, res, next) {
	try {
		const { userName, imdbID } = req.params
		if (userName && userName.length <= 40) {
			const user = await getUser({ userName }, 'userID')
			if (user && user.userID) {
				const count = await getCountUserWatchedMovie(imdbID, user.userID)
				return res.send({
					type: 'success',
					status: 200,
					body: count,
				})
			}
			return res.send({
				type: 'error',
				status: 400,
				body: { Eng: 'username not found', Fr: "Nom d'utilisateur introuvable" },
			})
		}
		return res.send({
			type: 'error',
			status: 400,
			body: { Eng: 'Wrong username', Fr: "Mauvais nom d'utilisateur" },
		})
	} catch (err) {
		next(err)
	}
}
module.exports = {
	getOneMovie,
	countWatchedMovies,
	lastWatchedMovies,
	countUserWatchedMovie,
}
