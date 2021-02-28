const { query } = require(__dirname + '/../services/mysqlService')

const getMovie = async function (imdbID, torrentHash) {
	const [movie] = await query('SELECT movieID,path FROM Movies WHERE imdbID=? AND torrentHash=?', [imdbID, torrentHash])
	return movie || {}
}
const insertMovie = async function (values) {
	const insertResult = await query('INSERT INTO Movies SET ?', [values])
	return insertResult.affectedRows ? insertResult : false
}
const updateMovie = async function (values, imdbID, torrentHash) {
	const resultUpdate = await query('Update Movies SET ? WHERE imdbID = ? AND torrentHash=?', [values, imdbID, torrentHash])
	return resultUpdate.affectedRows ? resultUpdate : false
}
const deleteMovie = async function (imdbID, torrentHash) {
	const resultDelete = await query('DELETE FROM Movies WHERE imdbID = ? AND torrentHash=?', [imdbID, torrentHash])
	return resultDelete.affectedRows ? resultDelete : false
}
const insertWatchedMovie = async function (values) {
	const insertResult = await query('INSERT INTO Viewed SET ?', [values])
	return insertResult.affectedRows ? insertResult : false
}
const updateWatchedMovie = async function (imdbID, userID) {
	const resultUpdate = await query('Update Viewed SET date=NOW() WHERE imdbID = ? AND userID = ?', [imdbID, userID])
	return resultUpdate.affectedRows ? resultUpdate : false
}

module.exports = {
	getMovie,
	insertMovie,
	updateMovie,
	deleteMovie,
	insertWatchedMovie,
	updateWatchedMovie,
}
