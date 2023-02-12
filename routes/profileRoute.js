const express = require('express')
const profileRoute = express.Router()
const { allProfiles, getProfile, getMyProfile, editProfile, editPassword, editImage } = require(__dirname + '/../controllers/profileController')

profileRoute.get('/allProfiles', allProfiles)
profileRoute.get('/allProfiles/:search', allProfiles)
profileRoute.get('/:userName', getProfile)
profileRoute.get('/', getMyProfile)
profileRoute.put('/', editProfile)
profileRoute.put('/password', editPassword)
profileRoute.put('/image', editImage)

module.exports = profileRoute
