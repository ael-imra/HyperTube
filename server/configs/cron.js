const cron = require('node-cron')
const { deleteMoviesNotWatched } = require('./services/movieService')

module.exports = function () {
	console.log(cron.validate('0 1 * * *'))
	cron.schedule('59 23 * * *', () => {
		deleteMoviesNotWatched()
	})
}
