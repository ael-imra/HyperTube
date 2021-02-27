const { query } = require(__dirname + '/../controllers/mysqlController')

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

module.exports = {
	getMovie,
	insertMovie,
	updateMovie,
	deleteMovie,
}
