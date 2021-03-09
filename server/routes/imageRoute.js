const express = require('express')
const serveImage = require('../controllers/imageController')

const imageRoute = express.Router()
imageRoute.get('/:path', serveImage)

module.exports = imageRoute
