const fs = require('fs')
const { updateMovie, insertMovie } = require('../models/movieModel')
const { downloadStream } = require('../services/downloadService')

const streamFromTorrent = async function (path, req, res, next) {
	try {
		const { torrentHash, imdbID } = req.params
		const { file } = await downloadStream(torrentHash, () => updateMovie({ isDownloaded: true }, imdbID, torrentHash))
		if (!path) insertMovie({ torrentHash, imdbID, path: file.path })
		const { range } = req.headers
		if (range) {
			const parts = range.replace('bytes=', '').split('-')
			const start = parseInt(parts[0])
			const end = parts[1] ? parseInt(parts[1]) : file.length - 1
			const chunkSize = end - start + 1
			const header = {
				'Content-Range': `bytes ${start}-${end}/${file.length}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunkSize,
				'Content-Type': 'video/mp4',
			}
			const streamFile = file.createReadStream({
				start,
				end,
			})
			res.writeHead(206, header)
			return streamFile.pipe(res)
		}
		const header = {
			'Content-Length': file.length,
			'Content-Type': 'video/mp4',
		}
		const streamFile = file.createReadStream()
		res.writeHead(206, header)
		return streamFile.pipe(res)
	} catch (err) {
		next(err)
	}
}

const streamFromPath = async function (path, req, res, next) {
	try {
		const fileStatus = await fs.promises.stat(path)
		const { range } = req.headers
		if (range) {
			const parts = range.replace('bytes=', '').split('-')
			const start = parseInt(parts[0])
			const end = parts[1] ? parseInt(parts[1]) : fileStatus.size - 1
			const chunkSize = end - start + 1
			const header = {
				'Content-Range': `bytes ${start}-${end}/${fileStatus.size}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunkSize,
				'Content-Type': 'video/mp4',
			}
			const streamFile = fs.createReadStream(path, {
				start,
				end,
			})
			res.writeHead(206, header)
			return streamFile.pipe(res)
		}
		const header = {
			'Content-Length': fileStatus.size,
			'Content-Type': 'video/mp4',
		}
		const streamFile = fs.createReadStream(path)
		res.writeHead(206, header)
		return streamFile.pipe(res)
	} catch (err) {
		next(err)
	}
}

module.exports = {
	streamFromPath,
	streamFromTorrent,
}
