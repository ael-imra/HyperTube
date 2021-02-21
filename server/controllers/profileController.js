const { checkUserInput } = require(__dirname + '/../services/userService')
const { getUser, updateUser } = require(__dirname + '/../models/userModel')
const bcrypt = require('bcrypt')
const { createImage } = require('../helper/indexHelper')
const { validateImage } = require('../helper/validatorHelper')
const fs = require('fs')

const getMyProfile = async function (req, res, next) {
	try {
		const user = await getUser({ userID: req.user }, ['userName', 'email', 'firstName', 'lastName', 'image'])
		return res.send({
			type: 'Success',
			status: 200,
			body: user,
		})
	} catch (err) {
		next(err)
	}
}
const getProfile = async function (req, res, next) {
	try {
		const error = checkUserInput(req.params, ['userName'])
		if (error)
			return res.send({
				type: 'Error',
				status: 400,
				body: error,
			})
		const user = await getUser({ userName: req.params.userName }, ['userName', 'firstName', 'lastName', 'image'])
		if (user)
			return res.send({
				type: 'Success',
				status: 200,
				body: user,
			})
		return res.send({
			type: 'Warn',
			status: 400,
			body: 'Profile not found',
		})
	} catch (err) {
		next(err)
	}
}
const editProfile = async function (req, res, next) {
	try {
		const error = checkUserInput(req.body, ['userName', 'email', 'firstName', 'lastName'])
		if (error)
			return res.send({
				type: 'Error',
				status: 400,
				body: error,
			})
		const resultUpdate = await updateUser({ userID: req.user }, req.body)
		if (resultUpdate)
			return res.send({
				type: 'Success',
				status: 200,
				body: 'Updated successful',
			})
		return res.send({
			type: 'Error',
			status: 403,
			body: 'Update failed',
		})
	} catch (err) {
		next(err)
	}
}
const editPassword = async function (req, res, next) {
	try {
		const errorNewPassword = checkUserInput({ password: req.body.newPassword }, ['password'])
		const errorOldPassword = checkUserInput({ password: req.body.oldPassword }, ['password'])
		if (errorOldPassword || errorNewPassword)
			return res.send({
				type: 'Error',
				status: 400,
				body: errorNewPassword || errorOldPassword,
			})
		const user = await getUser({ userID: req.user }, ['password'])
		const comparePassword = await bcrypt.compare(req.body.oldPassword, user.password)
		if (!comparePassword)
			return res.send({
				type: 'Error',
				status: 400,
				body: 'Incorrect password',
			})
		const hashNewPassword = await bcrypt.hash(req.body.newPassword, 5)
		const resultUpdate = await updateUser({ userID: req.user }, { password: hashNewPassword })
		if (resultUpdate)
			return res.send({
				type: 'Success',
				status: 200,
				body: 'Updated successful',
			})
		return res.send({
			type: 'Error',
			status: 403,
			body: 'Update failed',
		})
	} catch (err) {
		next(err)
	}
}
const editImage = async function (req, res, next) {
	try {
		const validImage = await validateImage(req.body.image)
		if (!validImage)
			return res.send({
				type: 'Error',
				status: 403,
				body: 'Incorrect image',
			})
		const imagePath = await createImage(req.body.image)
		const user = await getUser({ userID: req.user }, ['image'])
		const resultUpdate = await updateUser({ userID: req.user }, { image: imagePath })
		if (resultUpdate) {
			if (user.image) fs.unlink(__dirname + '/..' + user.image, (err) => console.log(err))
			return res.send({
				type: 'Success',
				status: 200,
				body: 'Updated successful',
			})
		}
		return res.send({
			type: 'Error',
			status: 403,
			body: 'Update failed',
		})
	} catch (err) {
		next(err)
	}
}

module.exports = {
	getMyProfile,
	getProfile,
	editProfile,
	editPassword,
	editImage,
}
