const OS = require('opensubtitles-api')
const fs = require('fs')
const path = require('path')
const torrentStream = require('torrent-stream')
const download = require('download')
const srt2vtt = require('srt-to-vtt')
const ffmpeg = require('fluent-ffmpeg')
const mkdirp = require('mkdirp')
const { opensubtitles_config } = require('../configs/indexConfig')

const convertStream = function (stream) {
	try {
		console.log('CONVERT')
		return {
			streamFile: new ffmpeg(stream)
				.format('webm')
				.on('error', (err) => {})
				.on('end', function () {
					console.log('Processing finished !')
				}),
		}
	} catch (err) {
		return { err }
	}
}

const downloadSubtitles = async function (imdbID) {
	const OpenSubtitles = new OS(opensubtitles_config)
	const subtitles = await OpenSubtitles.search({
		imdbid: imdbID,
		extensions: ['vtt', 'srt'],
	})
	Object.keys(subtitles).map(async (key) => {
		if (key === 'fr' || key === 'en') {
			const dirPath = path.join(__dirname, '..', 'downloads/subtitles', imdbID)
			const filePath = path.join(dirPath, `${key}.vtt`)
			console.log('DIR', dirPath, filePath)
			if (!fs.existsSync(dirPath)) {
				const made = await mkdirp(dirPath)
				fs.writeFile(filePath, '', (err) => {
					console.log(err, 'err')
					if (!err) download(subtitles[key].url).pipe(srt2vtt()).pipe(fs.createWriteStream(filePath))
				})
			} else fs.writeFile(filePath, '', (err) => (!err ? download(subtitles[key].url).pipe(srt2vtt()).pipe(fs.createWriteStream(filePath)) : 0))
		}
	})
}

const downloadStream = async function (torrentHash) {
	return new Promise((resolve) => {
		try {
			const engine = torrentStream(torrentHash, {
				path: __dirname + '/../downloads/videos',
			})
			engine.on('ready', () => {
				/**
				 * sort files desc
				 * portended the large file is video
				 */
				console.log('ready')
				engine.files.sort((file1, file2) => file2.length - file1.length)
				resolve({ file: engine.files[0] })
			})
		} catch (err) {
			resolve({ err })
		}
	})
}

module.exports = {
	downloadStream,
	downloadSubtitles,
	convertStream,
}
