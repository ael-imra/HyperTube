const { getMovie } = require('../models/movieModel')
const { streamFromTorrent, streamFromPath } = require('./streamController')

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
		if (movie.isDownloaded) return streamFromPath(movie.path, req, res, next)
		return streamFromTorrent(movie, req, res, next)
	} catch (err) {
		next(err)
	}
}
module.exports = {
	getOneMovie,
}
