const fs = require('fs')
const path = require('path')
const { downloadSubtitles } = require('../services/streamService')
const getSubtitle = async function (req, res, next) {
	try {
		const { imdbID, lang } = req.params
		if (typeof imdbID === 'string' && imdbID.length <= 10 && (lang === 'fr.vtt' || lang === 'en.vtt')) {
			const filename = path.join(__dirname, '../downloads/subtitles', `${imdbID}/${lang}`)
			if (!fs.existsSync(filename)) await downloadSubtitles(imdbID)
			if (fs.existsSync(filename)) {
				console.log(filename, 'FILE')
				res.setHeader('Content-Type', 'text/vtt')
				return res.send(fs.readFileSync(filename).toString())
			}
		}
		return res.send({
			type: 'error',
			status: 400,
			body: 'Incorrect parameters',
		})
	} catch (err) {
		next(err)
	}
}

module.exports = {
	getSubtitle,
}
