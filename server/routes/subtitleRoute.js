const express = require('express')
const { getSubtitle } = require('../controllers/subtitleController')
const subtitleRoute = express.Router()

subtitleRoute.get('/:subtileName', getSubtitle)
module.exports = subtitleRoute
