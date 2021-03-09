const errorHandler = function (err, req, res, next) {
	if (err)
		res.send({
			type: 'error',
			status: 403,
			body: 'Something wrong please try again',
		})
	else next()
}
module.exports = errorHandler
