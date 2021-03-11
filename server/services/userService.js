const { sign } = require('jsonwebtoken')

const { validator } = require(__dirname + '/../helper/validatorHelper')
const { getUser, updateUser } = require(__dirname + '/../models/userModel')
const { keys } = require(__dirname + '/../configs/indexConfig')

/**
 * CHECK USER INPUT BY CHECKING KEYS AND VALIDATE VALUE BY VALIDATOR
 * RETURN ERROR
 **/
const checkUserInput = function (inputs, properties) {
	if (inputs instanceof Object) {
		for (const key in inputs) if (properties.indexOf(key) === -1) return { Eng: `Error unsupported key ${key}`, Fr: `Erreur clé non prise en charge ${key}` }
		for (const key of properties) {
			if (Object.keys(inputs).indexOf(key) === -1) return { Eng: 'Error missing some inputs', Fr: 'Erreur manquant certaines entrées' }
			if (!validator(key, inputs[key])) return { Eng: `Incorrect ${key}`, Fr: `Incorrect ${key}` }
		}
		return ''
	}
	return { Eng: `Incorrect input`, Fr: `Entrée incorrecte` }
}

const getJWT = async function (userID) {
	const user = await getUser({ userID }, 'jwt')
	if (user && user.jwt) return user.jwt
	const jwt = sign({ userID }, keys.jwt)
	updateUser(userID, { jwt })
	return jwt
}

module.exports = {
	checkUserInput,
	getJWT,
}
