const jsonwebtoken = require('jsonwebtoken')
const { checkUserInput } = require('../services/user.service')
const { query } = require('../models/mysql.model')

const register = function (body){
  const error = checkUserInput(body,["Email","Username","Lastname","Firstname","Password"])
  if (error)
    return ({
      type:"Error",
      status:400,
      content:error
    })
  query('INSERT INTO Users SET ?',body)
  return ({
    type:"Success",
    status:200,
    content:"Registration Successful"
  })
}

const login = async function (body){
  const error = checkUserInput(body,["Username","Password"])
  if (error)
    return ({
      type:"Error",
      status:400,
      content:error
    })
  const [{UserID,IsActive,JWT}] = await query('SELECT UserID,IsActive,JWT FROM Users WHERE Username=? AND Password=?',[body.Username,body.Password])
  if (JWT)
    return ({
      type:"Success",
      status: 200,
      content: JWT
    })
  else if (IsActive)
    return ({
      type:"Success",
      status: 200,
      content: jsonwebtoken.sign({UserID},)
    })
}