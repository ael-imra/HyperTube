const fs = require('fs')
const { insertMovie, insertWatchedMovie, updateWatchedMovie, updateMovie } = require('../models/movieModel')
const { downloadStream, convertStream } = require('../services/streamService')
const path = require('path')

const streamFromPath = function (path, req, res, next) {
	try {
		console.log(path)
		const filePath = path.join(__dirname, '../downloads/videos', path)
		const ext = path.extname(filePath).replace('.', '')
		if (fs.existsSync(filePath)) {
			const { range } = req.headers
			const statusFile = fs.statSync(filePath)
			if (range) {
				const parts = range.replace('bytes=', '').split('-')
				const start = parseInt(parts[0])
				const end = parts[1] ? parseInt(parts[1]) : statusFile.size - 1
				const chunkSize = end - start + 1
				const header = {
					'Content-Range': `bytes ${start}-${end}/${statusFile.size}`,
					'Accept-Ranges': 'bytes',
					'Content-Length': chunkSize,
					'Content-Type': `video/${ext}`,
				}
				const streamFile = fs.createReadStream(filePath, {
					start,
					end,
				})
				res.writeHead(206, header)
				return streamFile.pipe(res)
			}
			const header = {
				'Content-Length': statusFile.size,
				'Content-Type': `video/${ext}`,
			}
			const streamFile = fs.createReadStream(filePath)
			res.writeHead(206, header)
			return streamFile.pipe(res)
		}
		return res.send({
			type: 'error',
			status: 403,
			body: 'No movie found',
		})
	} catch (err) {
		next(err)
	}
}

const streamFromTorrent = async function (movieExist, req, res, next) {
	try {
		const { torrentHash, imdbID } = req.params
		const streamObject = await downloadStream(torrentHash, () => {
			updateMovie({ isDownloaded: true }, imdbID, torrentHash)
		})
		console.log(streamObject.needConvert, 'OK')
		const ext = path.extname(streamObject.file.name).replace('.', '')
		if (streamObject.err)
			return res.send({
				type: 'error',
				status: 403,
				body: 'Movie not found',
			})
		if (!Object.keys(movieExist).length) {
			insertMovie({
				torrentHash,
				imdbID,
				path: streamObject.needConvert ? streamObject.file.path.replace(ext, '.webm') : streamObject.file.path,
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
		return convertStream(res, streamObject.file, () => {
			if (fs.existsSync(path.join(__dirname, '../downloads/videos', streamObject.file.path.replace(ext, '.webm'))))
				fs.unlink(path.join(__dirname, '../downloads/videos', streamObject.file.path))
			updateMovie({ isDownloaded: true }, imdbID, torrentHash)
		})
		// console.log(err, streamFile)
		// return res.end()
		// return streamFile.pipe(res)
	} catch (err) {
		next(err)
	}
}

module.exports = {
	streamFromTorrent,
	streamFromPath,
}
