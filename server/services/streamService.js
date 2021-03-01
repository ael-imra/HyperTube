const OS = require('opensubtitles-api')
const fs = require('fs')
const path = require('path')
const torrentStream = require('torrent-stream')
const download = require('download')
const srt2vtt = require('srt-to-vtt')
const ffmpeg = require('fluent-ffmpeg')
const mkdirp = require('mkdirp')
const { opensubtitles_config } = require('../configs/indexConfig')

const convertStream = async function (res, file, completedDownload) {
	try {
		const ext = path.extname(file.path)
		let begin = false
		const filePath = path.join(__dirname, '../downloads/videos', file.path.replace(ext, '.webm'))
		const header = {
			'Content-Length': file.length,
			'Content-Type': `video/${ext}`,
		}
		res.writeHead(206, header)
		new ffmpeg(file.createReadStream())
			.format('webm')
			.save(filePath)
			.pipe(res)
			.on('error', (err) => {
				console.log(err)
			})
			.on('end', function () {
				completedDownload()
			})
	} catch (err) {
		console.log(err)
		return { err }
	}
}
const downloadSubtitles = function (imdbID, lang) {
	return new Promise(async (resolve) => {
		const OpenSubtitles = new OS(opensubtitles_config)
		const subtitles = await OpenSubtitles.search({
			imdbid: imdbID,
			extensions: ['vtt', 'srt'],
		})
		if (lang in subtitles) {
			const dirPath = path.join(__dirname, '..', 'downloads/subtitles', imdbID)
			const filePath = path.join(dirPath, `${lang}.vtt`)
			if (!fs.existsSync(dirPath)) {
				const made = await mkdirp(dirPath)
				if (made)
					fs.writeFile(filePath, '', (err) => {
						download(subtitles[lang].url)
							.pipe(srt2vtt())
							.pipe(fs.createWriteStream(filePath).on('finish', () => resolve()))
					})
			} else
				fs.writeFile(filePath, '', (err) => {
					download(subtitles[lang].url)
						.pipe(srt2vtt())
						.pipe(fs.createWriteStream(filePath).on('finish', () => resolve()))
				})
		} else resolve()
	})
}

const downloadStream = async function (torrentHash, completedDownload) {
	return new Promise((resolve) => {
		try {
			const engine = torrentStream('magnet:?xt=urn:btih:' + torrentHash, {
				path: __dirname + '/../downloads/videos',
			})
			let needConvert = false
			engine.on('ready', () => {
				/**
				 * sort files desc
				 * portended the large file is video
				 */
				engine.files.sort((file1, file2) => file2.length - file1.length)
				const ext = path.extname(engine.files[0].name).replace('.', '')
				if (ext !== 'mp4' && ext !== 'opgg' && ext !== 'webm') needConvert = true
				resolve({ file: engine.files[0], needConvert })
			})
			engine.on('download', () => {
				if (engine.files[0].length <= engine.swarm.downloaded && !needConvert) completedDownload()
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
