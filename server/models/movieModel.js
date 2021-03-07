const { query } = require(__dirname + '/../services/mysqlService')

const getMovie = async function (imdbID, torrentHash) {
	const [movie] = await query('SELECT movieID,path,isDownloaded FROM Movies WHERE imdbID=? AND torrentHash=?', [imdbID, torrentHash])
	return movie || {}
}
const getLastWatchedMovie = async function (userID, limit) {
	const movies = await query('SELECT * FROM Viewed WHERE userID=? ORDER BY date LIMIT ?', [userID, limit])
	return movies
}
const getUnwatchedMovie = async function () {
	const movies = await query('SELECT moviePath from Viewed v,Movies m WHERE m.imdbID=v.imdbID AND DATEDIFF(NOW(),v.date)>=30')
	return movies
}
const getCountWatchedMovie = async function (imdbID) {
	const [{ count }] = await query('SELECT COUNT(*) as count FROM Viewed WHERE imdbID=?', imdbID)
	return count
}
const insertMovie = async function (values) {
	const insertResult = await query('INSERT INTO Movies SET ?', [values])
	return insertResult.affectedRows ? insertResult : false
}
const insertWatchedMovie = async function (values) {
	const insertResult = await query('INSERT INTO Viewed SET ?', [values])
	return insertResult.affectedRows ? insertResult : false
}
const updateMovie = async function (values, imdbID, torrentHash) {
	const resultUpdate = await query('Update Movies SET ? WHERE imdbID = ? AND torrentHash=?', [values, imdbID, torrentHash])
	return resultUpdate.affectedRows ? resultUpdate : false
}
const updateWatchedMovie = async function (imdbID, userID) {
	const resultUpdate = await query('Update Viewed SET date=NOW() WHERE imdbID = ? AND userID = ?', [imdbID, userID])
	return resultUpdate.affectedRows ? resultUpdate : false
}
const deleteMovies = async function () {
	const resultDelete = await query('DELETE FROM Movies WHERE DATEDIFF(NOW(),date)>=30')
	return resultDelete.affectedRows ? resultDelete : false
}
module.exports = {
	getMovie,
	insertMovie,
	updateMovie,
	deleteMovies,
	insertWatchedMovie,
	updateWatchedMovie,
	getCountWatchedMovie,
	getUnwatchedMovie,
	getLastWatchedMovie,
}
