const OS = require('opensubtitles-api')
const http = require('http')
const fs = require('fs')
const path = require('path')
const torrentStream = require('torrent-stream')
const download = require('download')
var srt2vtt = require('srt-to-vtt')

const downloadSubtitles = async function (imdbID) {
	const OpenSubtitles = new OS({
		useragent: 'UserAgent',
		username: '1337Hypertube',
		password: 'ael-imra@1337',
	})
	const subtitles = await OpenSubtitles.search({
		imdbid: imdbID,
		extensions: ['vtt', 'srt'],
	})
	Object.keys(subtitles).map(async (key) => {
		if (key === 'fr' || key === 'en') {
			const dirPath = path.join(__dirname, '..', 'downloads/subtitles')
			const filePath = path.join(dirPath, `${imdbID}_${key}.vtt`)
			if (!fs.existsSync(dirPath))
				fs.mkdir(dirPath, () => {
					fs.writeFile(filePath, '', (err) => (!err ? download(subtitles[key].url).pipe(srt2vtt()).pipe(fs.createWriteStream(filePath)) : 0))
				})
			else fs.writeFile(filePath, '', (err) => (!err ? download(subtitles[key].url).pipe(srt2vtt()).pipe(fs.createWriteStream(filePath)) : 0))
		}
	})
}

const downloadStream = async function (torrentHash, completeDownload) {
	return new Promise((resolve) => {
		let counter = 0
		const engine = torrentStream(torrentHash, {
			path: __dirname + '/../downloads/videos',
		})
		// console.log('HELLO', torrentHash, engine)
		// let sizeFiles = 0
		engine.on('ready', () => {
			/**
			 * sort files desc
			 * portended the large file is video
			 */
			console.log('ready')
			engine.files.sort((file1, file2) => file2.length - file1.length)
			// engine.files.map((f) => (sizeFiles += f.length))
			const file = engine.files[0]
			resolve({ file })
		})
		engine.on('idle', () => {
			console.log('idle')
		})
		// engine.on('download', (index, buffer) => {
		// 	console.log(index, buffer.toString(), 'OK')
		// 	if (sizeFiles === engine.swarm.downloaded) completeDownload()
		// })
		engine.on('verify', (index) => {
			counter++
			console.log(index, 'verify', counter, engine.torrent.pieces.length)
		})
	})
}

module.exports = {
	downloadStream,
	downloadSubtitles,
}
