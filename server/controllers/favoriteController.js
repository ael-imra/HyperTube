const { getFavorites, checkFavoriteMovie, insertFavorite, deleteFavorite } = require('../models/favoriteModel')
const { keys } = require(__dirname + '/../configs/indexConfig')
const axios = require('axios')

const getAllFavorites = async function (req, res, next) {
	try {
		const { justImdbID } = req.params
		const allFavorites = await getFavorites(req.user, justImdbID)
		if (allFavorites.length > 0)
			return res.send({
				type: 'success',
				status: 200,
				body: allFavorites,
			})
		return res.send({
			type: 'error',
			status: 403,
			body: 'Favorites not found',
		})
	} catch (err) {
		next(err)
	}
}

const addFavorite = async function (req, res, next) {
	try {
		const { imdbID } = req.body
		if (typeof imdbID !== 'string' || imdbID.trim().length > 10)
			return res.send({
				type: 'error',
				status: 400,
				body: 'Incorrect imdbID',
			})
		const movieDB = await checkFavoriteMovie(imdbID.trim(), req.user)
		if (movieDB.found)
			return res.send({
				type: 'warning',
				status: 403,
				body: 'Already have this movie on favorite',
			})
		if (movieDB.movieTitle) {
			const resultInsert = await insertFavorite({
				userID: req.user,
				imdbID: imdbID.trim(),
				...movieDB,
			})
			if (resultInsert.insertId)
				return res.send({
					type: 'success',
					status: 200,
					body: resultInsert.insertId,
				})
			return res.send({
				type: 'error',
				status: 403,
				body: 'Insert failed',
			})
		}
		const movie = await axios.get(`https://api.themoviedb.org/3/movie/${imdbID.trim()}?api_key=${keys.themoviedb}`)
		const { original_title, poster_path, overview, runtime, original_language, genres, release_date } = movie.data
		const resultInsert = await insertFavorite({
			userID: req.user,
			imdbID: imdbID.trim(),
			movieTitle: original_title,
			movieImage: poster_path,
			movieDescription: overview,
			movieTime: runtime,
			movieLanguage: original_language,
			movieGender: JSON.stringify(genres),
			movieRelease: new Date(release_date).getFullYear(),
		})
		if (resultInsert.insertId)
			return res.send({
				type: 'success',
				status: 200,
				body: resultInsert.insertId,
			})
		return res.send({
			type: 'error',
			status: 403,
			body: 'Insert failed',
		})
	} catch (err) {
		if (err.response)
			return res.send({
				type: 'error',
				status: 403,
				body: 'Movie not found',
			})
		next(err)
	}
}

const removeFavorite = async function (req, res, next) {
	try {
		const { imdbID } = req.body
		if (typeof imdbID !== 'string' || imdbID.trim().length > 10)
			return res.send({
				type: 'error',
				status: 400,
				body: 'Incorrect imdbID',
			})
		const deleteResult = await deleteFavorite(imdbID.trim(), req.user)
		if (deleteResult)
			return res.send({
				type: 'success',
				status: 200,
				body: 'Deleted successful',
			})
		return res.send({
			type: 'error',
			status: 403,
			body: 'Deleted failed',
		})
	} catch (err) {
		next(err)
	}
}

module.exports = {
	getAllFavorites,
	addFavorite,
	removeFavorite,
}
