const fs = require('fs')
const path = require('path')
const getSubtitle = async function (req, res, next) {
	try {
		const { imdbID, lang } = req.params
		if (typeof imdbID === 'string' && imdbID.length <= 10 && (lang === 'fr' || lang === 'eng')) {
            if (fs.existsSync(path.join(__dirname,'downloads/subtitles',`${imdbID}_${lang}.str`)))
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
