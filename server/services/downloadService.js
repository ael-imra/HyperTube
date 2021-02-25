const OS = require('opensubtitles-api')
const http = require('http')
const fs = require('fs')
const path = require('path')
const torrentStream = require('torrent-stream')

const downloadSubtitles = async function (imdbID) {
	const OpenSubtitles = new OS({
		useragent: 'UserAgent',
		username: '1337Hypertube',
		password: 'ael-imra@1337',
		ssl: true,
	})
	const subtitles = await OpenSubtitles.search({
		imdbid: imdbID,
		extensions: ['vtt', 'srt'],
	})
	Object.keys(subtitles).map((key) => {
		if (key === 'fr' || key === 'en') {
			const file = fs.createWriteStream(path.join(__dirname, '..', 'downloads/subtitles', `${imdbID}_${subtitles[key].lang}${path.extname(subtitles[key].filename)}`))
			http.get(subtitles[key].url).then((response) => response.pipe(file))
		}
	})
}

const downloadStream = async function (torrentHash, completeDownload) {
	return new Promise((resolve) => {
		const engine = torrentStream(torrentHash, {
			path: __dirname + '/../downloads/videos',
		})
		let sizeFiles = 0
		engine.on('ready', () => {
			/**
			 * sort files desc
			 * portended the large file is video
			 */
			engine.files.sort((file1, file2) => file2.length - file1.length)
			engine.files.map((f) => (sizeFiles += f.length))
			const file = engine.files[0]
			resolve({ file })
		})
		engine.on('download', () => {
			if (sizeFiles === engine.swarm.downloaded) completeDownload()
		})
	})
}

module.exports = {
	downloadStream,
	downloadSubtitles,
}
