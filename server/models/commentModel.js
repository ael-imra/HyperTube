const { query } = require(__dirname + '/../services/mysqlService')

const getComments = async function (imdbID) {
	const comments = await query(`SELECT commentID,commentContent,date,u.userName,image FROM Comments c,Users u WHERE u.userID=c.userID AND imdbID=?`, imdbID)
	return comments
}

const insertComment = async function (values) {
	const resultInsert = await query('INSERT INTO Comments SET ?', [values])
	return resultInsert.affectedRows ? resultInsert : false
}

const deleteComment = async function (imdbID, userID) {
	const resultDelete = await query('DELETE FROM Comments WHERE imdbID = ? AND userID=?', [imdbID, userID])
	return resultDelete.affectedRows ? resultDelete : false
}

module.exports = {
	getComments,
	insertComment,
	deleteComment,
}
