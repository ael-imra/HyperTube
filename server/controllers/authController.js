const { checkUserInput } = require(__dirname + '/../services/userService')
const { generateToken } = require(__dirname + '/../helper/indexHelper')
const bcrypt = require('bcrypt')
const { getJWT } = require('../services/userService')
const { sendMail } = require(__dirname + '/../helper/mailHelper')
const { getUser, insertLocalUser, updateUser, checkUserExist } = require(__dirname + '/../models/userModel')
const { clientPort } = require(__dirname + '/../configs/indexConfig')

const register = async function (req, res, next) {
	try {
		const error = checkUserInput(req.body, ['email', 'userName', 'lastName', 'firstName', 'password'])
		if (error)
			return res.send({
				type: 'error',
				status: 400,
				body: error,
			})
		const { userName, email, password } = req.body
		const checkResult = await checkUserExist(userName, email)
		if (!checkResult) {
			const token = generateToken(128)
			sendMail('active', email, userName, `http://localhost:1337/auth/active`, token)
			req.body.password = await bcrypt.hash(password, 5)
			const insertSuccessful = await insertLocalUser({ ...req.body, userFrom: 'local', token })
			if (insertSuccessful)
				return res.send({
					type: 'success',
					status: 200,
					body: { Eng: 'Registration successful', Fr: 'Inscription réussi' },
				})
			return res.send({
				type: 'error',
				status: 400,
				body: { Eng: 'Registration Failed', Fr: "Échec de l'enregistrement" },
			})
		}
		return res.send({
			type: 'warning',
			status: 403,
			body: { Eng: `${checkResult} already exist`, Fr: `${checkResult} existe déjà` },
		})
	} catch (err) {
		next(err)
	}
}

const login = async function (req, res, next) {
	try {
		const error = checkUserInput(req.body, ['userName', 'password'])
		if (error)
			return res.send({
				type: 'error',
				status: 400,
				body: error,
			})
		const { userName, password } = req.body
		const user = await getUser({ userName: userName }, ['userID', 'password', 'isActive'])
		if (user) {
			if (user.userID.indexOf('go') > -1 || user.userID.indexOf('gi') > -1 || user.userID.indexOf('42') > -1)
				return res.send({
					type: 'warning',
					status: 403,
					body: { Eng: "You can't login with this username", Fr: "Vous ne pouvez pas vous connecter avec ce nom d'utilisateur" },
				})
			const checkPassword = await bcrypt.compare(password, user.password)
			if (!checkPassword)
				return res.send({
					type: 'error',
					status: 401,
					body: { Eng: 'Incorrect password', Fr: 'Mot de passe incorrect' },
				})
			if (user.isActive) {
				const jwt = await getJWT(user.userID)
				res.cookie('jwtToken', jwt, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false })
				return res.send({
					type: 'success',
					status: 200,
					body: { Eng: 'user authenticated', Fr: 'utilisateur authentifié' },
				})
			} else if (user.isActive === 0)
				return res.send({
					type: 'warning',
					status: 403,
					body: { Eng: 'You must activate the account', Fr: 'Vous devez activer le compte' },
				})
		}
		return res.send({
			type: 'error',
			status: 401,
			body: { Eng: 'Incorrect userName or password', Fr: 'Identifiant ou mot de passe incorrect' },
		})
	} catch (err) {
		next(err)
	}
}

const resetPassword = async function (req, res, next) {
	try {
		const error = checkUserInput(req.body, ['email'])
		if (error)
			return res.send({
				type: 'error',
				status: 400,
				body: error,
			})
		const { email } = req.body
		const user = await getUser({ email }, ['userFrom', 'userName', 'isActive', 'token'])
		if (user & user.userFrom)
			return res.redirect(
				`http://localhost:${clientPort}/failed/${JSON.stringify({
					Eng: 'Cannot reset password with this email',
					Fr: 'Impossible de réinitialiser le mot de passe avec cet e-mail',
				})}`
			)
		if (user) {
			if (!user.isActive)
				return res.redirect(
					`http://localhost:${clientPort}/failed/${JSON.stringify({
						Eng: 'Please verify your email than reset your password',
						Fr: 'Veuillez vérifier votre adresse e-mail avant de réinitialiser votre mot de passe',
					})}`
				)
			sendMail('reset', email, user.userName, `http://localhost:${clientPort}/ResetPassword/${user.token}`)
			return res.redirect(
				`http://localhost:${clientPort}/success/${JSON.stringify({
					Eng: 'Check your email to reset password',
					Fr: 'Vérifiez votre messagerie pour réinitialiser le mot de passe',
				})}`
			)
		}
		return res.redirect(`http://localhost:${clientPort}/failed/${JSON.stringify({ Eng: 'Incorrect email', Fr: 'Adresse Email incorrecte' })}`)
	} catch (err) {
		next(err)
	}
}
const updatePassword = async function (req, res, next) {
	try {
		const { token, oldPassword, newPassword } = req.body
		const tokenError = checkUserInput({ token }, ['token'])
		const newPasswordError = checkUserInput({ password: newPassword }, ['password'])
		const oldPasswordError = checkUserInput({ password: oldPassword }, ['password'])
		if (tokenError || newPasswordError || oldPasswordError)
			return res.send({
				type: 'error',
				status: 400,
				body: tokenError || newPasswordError || oldPasswordError,
			})
		const user = await getUser({ token }, ['password', 'userID'])
		console.log(user, 'TOKEN')
		if (user && user.password) {
			return bcrypt.compare(oldPassword, user.password, async (err, compare) => {
				console.log(compare, 'comp')
				if (err || !compare)
					return res.send({
						type: 'error',
						status: 400,
						body: { Eng: "old password doesn't match", Fr: "l'ancien mot de passe ne correspond pas" },
					})
				updateUser(user.userID, { password: await bcrypt.hash(newPassword, 5) })
				return res.send({
					type: 'error',
					status: 400,
					body: { Eng: 'Updated successful', Fr: 'Mise à jour réussie' },
				})
			})
		}
		return res.send({
			type: 'error',
			status: 400,
			body: { Eng: 'Invalid token', Fr: 'Jeton invalide' },
		})
	} catch (err) {
		next(err)
	}
}
const activeAccount = async function (req, res, next) {
	try {
		const error = checkUserInput(req.params, ['token'])
		if (error)
			return res.send({
				type: 'error',
				status: 400,
				body: error,
			})
		const { token } = req.params
		const user = await getUser({ token }, 'userID')
		if (user) {
			const token = generateToken(128)
			updateUser(user.userID, { token, isActive: 1 })
			return res.send({
				type: 'success',
				status: 200,
				body: { Eng: 'Your account has been activated successfully', Fr: 'Votre compte a été activé avec succès' },
			})
		}
		return res.send({
			type: 'error',
			status: 400,
			body: { Eng: 'Incorrect token', Fr: 'Jeton incorrect' },
		})
	} catch (err) {
		next(err)
	}
}
const checkToken = async function (req, res, next) {
	try {
		const error = checkUserInput(req.params, ['token'])
		if (error)
			return res.send({
				type: 'error',
				status: 400,
				body: error,
			})
		const { token } = req.params
		const user = await getUser({ token }, 'userID')
		if (user)
			return res.send({
				type: 'success',
				status: 200,
				body: true,
			})
		return res.send({
			type: 'error',
			status: 200,
			body: false,
		})
	} catch (err) {
		next(err)
	}
}
module.exports = {
	register,
	login,
	resetPassword,
	updatePassword,
	activeAccount,
	checkToken,
}
