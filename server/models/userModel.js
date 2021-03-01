const { query } = require(__dirname + '/../services/mysqlService')

const getUser = async function (dependencies, keys) {
	const [user] = await query(`SELECT ${keys.toString()} FROM Users WHERE ?`, dependencies)
	return user
}

const insertUser = async function (values) {
	const resultInsert = await query('INSERT INTO Users SET ?', [values])
	return resultInsert.affectedRows ? resultInsert : false
}

const updateUser = async function (dependencies, values) {
	const resultUpdate = await query('UPDATE Users SET ? WHERE ?', [values, dependencies])
	return resultUpdate.affectedRows ? resultUpdate : false
}

const deleteUser = async function (dependencies) {
	const resultDelete = await query('DELETE FROM Users WHERE ?', [dependencies])
	return resultDelete.affectedRows ? resultDelete : false
}
const checkUserExist = async function (username, email) {
	const [user] = await query('SELECT userID FROM Users WHERE userName=? OR email=?', [username, email])
	return user ? true : false
}

module.exports = {
	getUser,
	insertUser,
	updateUser,
	deleteUser,
	checkUserExist,
}
