const fs = require('fs')
const { insertMovie, insertWatchedMovie, updateWatchedMovie, updateMovie } = require('../models/movieModel')
const { downloadStream, convertStream, getFileStream } = require('../services/streamService')
const path = require('path')

const stream = async function (movie, req, res, next) {
	try {
		const { torrentHash, imdbID } = req.params
		let streamObject = {}
		if (!movie.isDownloaded)
			streamObject = await downloadStream(torrentHash, () => {
				updateMovie({ isDownloaded: true }, imdbID, torrentHash)
			})
		else streamObject = await getFileStream(movie.path)
		console.log(movie, 'movie', streamObject)
		const ext = path.extname(streamObject.file.name).replace('.', '')
		if (streamObject.err)
			return res.send({
				type: 'error',
				status: 403,
				body: 'Movie not found',
			})
		if (!Object.keys(movie).length) {
			insertMovie({
				torrentHash,
				imdbID,
				path: streamObject.file.path,
			})
			insertWatchedMovie({ imdbID, userID: req.user })
		} else updateWatchedMovie(imdbID, req.user)
		const { range } = req.headers
		if (!streamObject.needConvert) {
			if (range) {
				const parts = range.replace('bytes=', '').split('-')
				const start = parseInt(parts[0])
				const end = parts[1] ? parseInt(parts[1]) : streamObject.file.length - 1
				const chunkSize = end - start + 1
				const header = {
					'Content-Range': `bytes ${start}-${end}/${streamObject.file.length}`,
					'Accept-Ranges': 'bytes',
					'Content-Length': chunkSize,
					'Content-Type': `video/${ext}`,
				}
				const streamFile = streamObject.file.createReadStream({
					start,
					end,
				})
				res.writeHead(206, header)
				return streamFile.pipe(res)
			}
			const header = {
				'Content-Length': streamObject.file.length,
				'Content-Type': `video/${ext}`,
			}
			const streamFile = streamObject.file.createReadStream()
			res.writeHead(206, header)
			return streamFile.pipe(res)
		}
		const { err, streamFile } = await convertStream(streamObject.file)
		if (err)
			return res.send({
				type: 'error',
				status: 403,
				body: 'Error to convert Movie',
			})
		console.log(streamFile)
		return streamFile.pipe(res)
	} catch (err) {
		next(err)
	}
}

module.exports = {
	stream,
}
