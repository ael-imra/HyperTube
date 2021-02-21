const { getComments, deleteComment, insertComment } = require('../models/commentModel')

const getAllComments = async function (req, res, next) {
	try {
		if (typeof req.params.imdbID !== 'string' || req.body.imdbID.length > 10)
			return res.send({
				type: 'Error',
				status: 400,
				body: 'Incorrect imdbID',
			})
		const allComments = await getComments(req.params.imdbID)
		if (allComments.length > 0)
			return res.send({
				type: 'Success',
				status: 200,
				body: allComments,
			})
		return res.send({
			type: 'Error',
			status: 403,
			body: 'Comments not found',
		})
	} catch (err) {
		next(err)
	}
}
const addComment = async function (req, res, next) {
	try {
		if (
			typeof req.body.imdbID !== 'string' ||
			!req.body.imdbID.trim() ||
			req.body.imdbID.trim().length > 10 ||
			typeof req.body.commentContent !== 'string' ||
			!req.body.commentContent.trim() ||
			req.body.commentContent.trim().length > 100
		)
			return res.send({
				type: 'Error',
				status: 400,
				body: 'Incorrect information',
			})
		const resultInsert = await insertComment({
			userID: req.user,
			imdbID: req.body.imdbID.trim(),
			commentContent: req.body.commentContent.trim(),
		})
		if (resultInsert.insertId)
			return res.send({
				type: 'Success',
				status: 200,
				body: resultInsert.insertId,
			})
		return res.send({
			type: 'Error',
			status: 403,
			body: 'Insert failed',
		})
	} catch (err) {
		next(err)
	}
}
const deleteOneComment = async function (req, res, next) {
	try {
		if (typeof req.body.imdbID !== 'string' || !req.body.imdbID.trim() || req.body.imdbID.trim().length > 10)
			return res.send({
				type: 'Error',
				status: 400,
				body: 'Incorrect imdbID',
			})
		const deleteResult = await deleteComment(req.body.imdbID, req.user)
		if (deleteResult)
			return res.send({
				type: 'Success',
				status: 200,
				body: 'Deleted successful',
			})
		return res.send({
			type: 'Error',
			status: 403,
			body: 'Deleted failed',
		})
	} catch (err) {
		next(err)
	}
}

module.exports = {
	getAllComments,
	deleteOneComment,
	addComment,
}
