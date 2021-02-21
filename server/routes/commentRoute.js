const express = require('express')
const commentRoute = express.Router()
const { getAllComments, deleteOneComment, addComment } = require(__dirname + '/../controllers/commentController')

commentRoute.get('/:imdbID', getAllComments)
commentRoute.delete('/:imdbID', deleteOneComment)
commentRoute.post('/', addComment)

module.exports = commentRoute
