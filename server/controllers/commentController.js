const { getComments, deleteComment, insertComment } = require('../models/commentModel')

const getAllComments = async function (req, res, next) {
	try {
		const { imdbID } = req.params
		if (typeof imdbID !== 'string' || imdbID.length > 10)
			return res.send({
				type: 'error',
				status: 400,
				body: 'Incorrect imdbID',
			})
		const allComments = await getComments(imdbID)
		if (allComments.length > 0)
			return res.send({
				type: 'success',
				status: 200,
				body: allComments,
			})
		return res.send({
			type: 'error',
			status: 403,
			body: 'Comments not found',
		})
	} catch (err) {
		next(err)
	}
}
const addComment = async function (req, res, next) {
	try {
		const { imdbID, commentContent } = req.body
		if (
			typeof imdbID !== 'string' ||
			!imdbID.trim() ||
			imdbID.trim().length > 10 ||
			typeof commentContent !== 'string' ||
			!commentContent.trim() ||
			commentContent.trim().length > 100
		)
			return res.send({
				type: 'error',
				status: 400,
				body: 'Incorrect information',
			})
		const resultInsert = await insertComment({
			userID: req.user,
			imdbID: imdbID.trim(),
			commentContent: commentContent.trim(),
		})
		if (resultInsert.insertId)
			return res.send({
				type: 'success',
				status: 200,
				body: resultInsert.insertId,
			})
		return res.send({
			type: 'error',
			status: 403,
			body: 'Insert failed',
		})
	} catch (err) {
		next(err)
	}
}
const removeComment = async function (req, res, next) {
	try {
		const { imdbID, commentID } = req.body
		if (typeof imdbID !== 'string' || !imdbID.trim() || imdbID.trim().length > 10 || typeof commentID !== 'number')
			return res.send({
				type: 'error',
				status: 400,
				body: 'Incorrect parameters',
			})
		const deleteResult = await deleteComment(imdbID.trim(), req.user)
		if (deleteResult)
			return res.send({
				type: 'success',
				status: 200,
				body: 'Deleted successful',
			})
		return res.send({
			type: 'error',
			status: 403,
			body: 'Deleted failed',
		})
	} catch (err) {
		next(err)
	}
}

module.exports = {
	getAllComments,
	removeComment,
	addComment,
}
