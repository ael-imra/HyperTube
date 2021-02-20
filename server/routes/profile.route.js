const express = require('express')
const router = express.Router()
const {getProfile,getMyProfile,editProfile} = require(__dirname+"//../controllers/profile.control")

router.get('/:userName',getProfile)
router.get('/',getMyProfile)
router.put('/',editProfile)

module.exports = router