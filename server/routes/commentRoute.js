const express = require('express')
const commentRoute = express.Router()
const { getAllComments, removeComment, addComment } = require(__dirname + '/../controllers/commentController')

commentRoute.get('/:imdbID', getAllComments)
commentRoute.delete('/', removeComment)
commentRoute.post('/', addComment)

module.exports = commentRoute
