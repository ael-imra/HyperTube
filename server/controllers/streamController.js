const fs = require('fs')
const { updateMovie, insertMovie } = require('../models/movieModel')
const { downloadStream, convertStream } = require('../services/streamService')
const path = require('path')

const streamFromTorrent = async function (movieExist, req, res, next) {
	try {
		const { torrentHash, imdbID } = req.params
		const streamObject = await downloadStream(torrentHash)
		if (streamObject.err)
			return res.send({
				type: 'error',
				status: 403,
				body: 'Movie not found',
			})
		if (!movieExist) insertMovie({ torrentHash, imdbID })
		const ext = path.extname(streamObject.file.name).replace('.', '')
		if (ext !== 'mp4' && ext !== 'opgg' && ext !== 'webm') streamObject.needConvert = true
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
		const { streamFile, err } = convertStream(streamObject.file.createReadStream())
		if (err)
			return res.send({
				type: 'error',
				status: 403,
				body: 'Failed to convert this movie',
			})
		return streamFile.pipe(res)
	} catch (err) {
		next(err)
	}
}

module.exports = {
	streamFromTorrent,
}
