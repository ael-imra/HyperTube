const { getMovie } = require('../models/movieModel')
const { downloadSubtitles } = require('../services/downloadService')
const { streamFromPath, streamFromTorrent } = require('./streamController')

const getOneMovie = async function (req, res, next) {
	try {
		const { imdbID, torrentHash } = req.params
		if (typeof imdbID !== 'string' || typeof torrentHash !== 'string' || imdbID.length > 10)
			return res.send({
				type: 'error',
				status: 400,
				body: 'Incorrect parameters',
			})
		const { path, isDownloaded } = await getMovie(imdbID, torrentHash)
		if (path && isDownloaded) return streamFromPath(path, req, res, next)
		// downloadSubtitles(imdbID)
		// res.end()
		return streamFromTorrent(path, req, res, next)
	} catch (err) {
		next(err)
	}
}
module.exports = {
	getOneMovie,
}
