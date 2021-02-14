const express = require('express')
const router = express.Router()

router.get('/:username',async (req,res)=>{
  const locals = req.app.locals
  const profileInfo = await locals.profileInfo(req.params)
  res.send({
    status:profileInfo.status,
    type:profileInfo.type,
    content:profileInfo.content
  })
})

router.post('/',async (req,res)=>{
  const locals = req.app.locals
  const editProfile = await locals.editProfile(req.body)
  res.send({
    status:editProfile.status,
    type:editProfile.type,
    content:editProfile.content
  })
})

module.exports = router