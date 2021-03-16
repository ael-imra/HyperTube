const { getUser } = require(__dirname + '/../models/userModel')
const { getCountWatchedMovie, getLastWatchedMovie, getCountUserWatchedMovie } = require(__dirname + '/../models/movieModel')

const lastWatchedMovies = async function (req, res, next) {
	try {
		let user = null
		if ('userName' in req.params) user = await getUser({ userName: req.params.userName }, 'userID')
		else user = { userID: req.user }
		if (user && user.userID) {
			const movies = await getLastWatchedMovie(user.userID, 10)
			if (movies)
				return res.send({
					type: 'success',
					status: 200,
					body: movies.reverse(),
				})
		}
		return res.send({
			type: 'error',
			status: 403,
			body: [],
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
				body: 0,
			})
		}
		return res.send({
			type: 'error',
			status: 400,
			body: 0,
		})
	} catch (err) {
		next(err)
	}
}

module.exports = {
	lastWatchedMovies,
	countUserWatchedMovies,
}
