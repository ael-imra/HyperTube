const OS = require('opensubtitles-api')
const fs = require('fs')
const path = require('path')
const torrentStream = require('torrent-stream')
const download = require('download')
const srt2vtt = require('srt-to-vtt')
const ffmpeg = require('fluent-ffmpeg')
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

const downloadStream = async function (torrentHash) {
	return new Promise((resolve) => {
		try {
			const engine = torrentStream(torrentHash, {
				path: __dirname + '/../downloads/videos',
				trackers: [
					'udp://open.demonii.com:1337/announce',
					'udp://tracker.openbittorrent.com:80',
					'udp://tracker.coppersurfer.tk:6969',
					'udp://glotorrents.pw:6969/announce',
					'udp://tracker.opentrackr.org:1337/announce',
					'udp://torrent.gresille.org:80/announce',
					'udp://p4p.arenabg.com:1337',
					'udp://tracker.leechers-paradise.org:6969',
					'udp://p4p.arenabg.ch:1337',
					'udp://tracker.internetwarriors.net:1337',
				],
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
