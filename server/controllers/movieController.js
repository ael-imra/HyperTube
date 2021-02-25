const { getMovie } = require('../models/movieModel')
const { streamFromPath, streamFromTorrent } = require('./streamController')

const getOneMovie = async function (req, res, next) {
	try {
		if (typeof req.params.imdbID !== 'string' || typeof req.params.torrentHash !== 'string' || req.params.imdbID.length > 10)
			return res.send({
				type: 'error',
				status: 400,
				body: 'Incorrect parameters',
			})
		const { path, isDownloaded } = await getMovie(req.params.imdbID, req.params.torrentHash)
		if (path && isDownloaded) return streamFromPath(path, req, res, next)
		return streamFromTorrent(path, req, res, next)
	} catch (err) {
		next(err)
	}
}
module.exports = {
	getOneMovie,
}
