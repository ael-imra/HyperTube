const fs = require('fs')
const path = require('path')
const getSubtitle = async function (req, res, next) {
	try {
		const { subtileName } = req.params
		if (typeof subtileName === 'string') {
			const filename = path.join(__dirname, 'downloads/subtitles', `${subtileName}`)
			if (fs.existsSync(filename)) {
				res.setHeader('Content-Type', 'text/vtt')
				fs.createReadStream(filename).pipe(res)
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
