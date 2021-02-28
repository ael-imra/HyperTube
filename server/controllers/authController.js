const { checkUserInput } = require(__dirname + '/../services/userService')
const { generateToken } = require(__dirname + '/../helper/indexHelper')
const bcrypt = require('bcrypt')
const { sendMail } = require(__dirname + '/../helper/mailHelper')
const { getUser, insertUser, updateUser, checkUserExist } = require(__dirname + '/../models/userModel')

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
		if (!(await checkUserExist(userName, email))) {
			const token = generateToken(128)
			const mailResult = await sendMail('active', email, userName, `http://${req.headers.host}/auth/active`, token)
			if (!mailResult.error) {
				req.body.password = await bcrypt.hash(password, 5)
				const insertSuccessful = await insertUser({ ...req.body, token })
				if (insertSuccessful)
					return res.send({
						type: 'success',
						status: 200,
						body: 'Registration Successful',
					})
				return res.send({
					type: 'error',
					status: 400,
					body: 'Registration Failed',
				})
			}
			return res.send({
				type: 'error',
				status: 400,
				body: 'Something wrong with email',
			})
		}
		return res.send({
			type: 'warning',
			status: 403,
			body: 'User already exist',
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
		const user = await getUser({ userName: userName }, ['userID', 'githubID', 'googleID', '42ID', 'password', 'isActive'])
		if (user) {
			if (user.githubID || user.googleID || user['42ID'])
				return res.send({
					type: 'warning',
					status: 403,
					body: "You can't login with this username",
				})
			const checkPassword = await bcrypt.compare(password, user.password)
			if (!checkPassword)
				return res.send({
					type: 'error',
					status: 401,
					body: 'Incorrect password',
				})
			if (user.isActive) {
				req.login(user.userID, (err) => err)
				return res.send({
					type: 'success',
					status: 200,
					body: 'user authenticated',
				})
			} else if (user.isActive === 0)
				return res.send({
					type: 'warning',
					status: 403,
					body: 'You must activate the account',
				})
		}
		return res.send({
			type: 'error',
			status: 401,
			body: 'Incorrect userName or password',
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
		const user = await getUser({ email }, ['userName', 'isActive', 'token'])
		if (user) {
			if (!user.isActive)
				return res.send({
					type: 'warning',
					status: 403,
					body: 'Please verify your email than reset your password',
				})
			const mailResult = await sendMail('active', email, user.userName, `http://${req.headers.host}/token=${user.token}`)
			if (!mailResult.error)
				return res.send({
					type: 'success',
					status: 200,
					body: 'Check your email to reset password',
				})
			return res.send({
				type: 'error',
				status: 400,
				body: 'Something wrong with email',
			})
		}
		return res.send({
			type: 'error',
			status: 400,
			body: 'Incorrect email',
		})
	} catch (err) {
		next(err)
	}
}
const activeAccount = async function (req, res, next) {
	try {
		const error = checkUserInput(req.body, ['token'])
		if (error)
			return res.send({
				type: 'error',
				status: 400,
				body: error,
			})
		const { token } = req.body
		const user = await getUser({ token }, 'userName')
		if (user) {
			const token = generateToken(128)
			updateUser({ userName: user.userName }, { token, isActive: 1 })
			return res.send({
				type: 'success',
				status: 200,
				body: 'Your account has been activated successfully',
			})
		}
		return res.send({
			type: 'error',
			status: 400,
			body: 'Incorrect token',
		})
	} catch (err) {
		next(err)
	}
}
module.exports = {
	register,
	login,
	resetPassword,
	activeAccount,
}
