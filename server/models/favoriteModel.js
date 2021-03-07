const { query } = require(__dirname + '/../services/mysqlService')

const getFavorites = async function (userID, justImdbID) {
	const needed = justImdbID
		? justImdbID
		: "favoriteID,imdbID,movieTitle,movieImage,movieLanguage,movieRelease,movieTime,movieGender,movieDescription,(SELECT COUNT(userID) FROM Viewed WHERE userID=f.userID AND imdbID=f.imdbID) AS 'watched'"
	const favorites = await query(`SELECT ${needed} FROM Favorites f WHERE userID=?`, userID)
	return favorites
}

const insertFavorite = async function (values) {
	const resultInsert = await query('INSERT INTO Favorites SET ?', [values])
	return resultInsert.affectedRows ? resultInsert : false
}

const deleteFavorite = async function (imdbID, userID) {
	const resultDelete = await query('DELETE FROM Favorites WHERE imdbID = ? AND userID=?', [imdbID, userID])
	return resultDelete.affectedRows ? resultDelete : false
}
const checkFavoriteMovie = async function (imdbID, userID) {
	const [user] = await query('SELECT userID FROM Favorites WHERE imdbID = ? AND userID=?', [imdbID, userID])
	if (user) return { found: true }
	/**
	 * get movieTitle and movieImage From db to avoid send request
	 */
	const [favoriteOfSomeone] = await query('SELECT movieImage,movieLanguage,movieRelease,movieTime,movieGender,movieDescription FROM Favorites WHERE imdbID=?', imdbID)
	return favoriteOfSomeone || {}
}

module.exports = {
	getFavorites,
	insertFavorite,
	deleteFavorite,
	checkFavoriteMovie,
}
