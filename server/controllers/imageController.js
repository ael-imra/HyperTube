const fs = require('fs')
const serveImage = async function (req, res, next) {
	try {
		const { filePath } = req.params
		if (filePath.length <= 255) if (fs.existsSync(__dirname + '/../image/' + filePath)) return res.sendFile(__dirname + '/../image/' + filePath)
		return res.end()
	} catch (err) {
		next(err)
	}
}
module.exports = serveImage
