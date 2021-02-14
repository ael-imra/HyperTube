const express = require('express')
const router = express.Router()

router.post('/login',async (req,res)=>{
  const locals = req.app.locals
  const login = await locals.login(req.body)
  res.send({
    status:login.status,
    type:login.type,
    content:login.content
  })
})

router.post('/register',async (req,res)=>{
  const locals = req.app.locals
  const register = await locals.register(req.body)
  res.send({
    status:register.status,
    type:register.type,
    content:register.content
  })
})

module.exports = router