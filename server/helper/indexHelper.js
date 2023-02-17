const Jimp = require('jimp')
const createImage = async function (src) {
	const buffer = Buffer.from(src.split('base64,')[1], 'base64')
	return new Promise(
		(resolve) =>
			new Jimp(buffer, (createError, value) => {
				//get extension from origin mime
				const ext = value._originalMime.split('image/')[1]
				const path = `/image/${Date.now()}.${ext}`
				resolve(path)
				value.write(__dirname + '/..' + path, (writeError) => writeError)
			})
	)
}

module.exports = {
	createImage,
}
