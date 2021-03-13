const { getUser } = require(__dirname + '/../models/userModel')
const { getCountWatchedMovie, getLastWatchedMovie, getCountUserWatchedMovie, getWatchedMovies } = require(__dirname + '/../models/movieModel')

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
		const movies = await getLastWatchedMovie(req.params || { userID: req.userID }, 10)
		if (movies)
			return res.send({
				type: 'success',
				status: 200,
				body: movies.reverse(),
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
const countUserWatchedMovies = async function (req, res, next) {
	try {
		const { userName } = req.params
		if (userName && userName.length <= 40) {
			const user = await getUser({ userName }, 'userID')
			if (user && user.userID) {
				const count = await getCountUserWatchedMovie(user.userID)
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
const watchedMovies = async function (req, res, next) {
	try {
		const movies = await getWatchedMovies(req.user)
		return res.send({
			type: 'success',
			status: 200,
			body: movies,
		})
	} catch (err) {
		next(err)
	}
}

module.exports = {
	watchedMovies,
	countWatchedMovies,
	lastWatchedMovies,
	countUserWatchedMovies,
}