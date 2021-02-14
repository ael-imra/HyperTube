const validate = require('validator')

const validator = function (key,value){
  if (key === "Email")
    return (validate.isEmail(value))
  else if (key === "Username")
    return (validate.isAlphanumeric(value))
  else if (key === "LastName" || key === "Firstname")
    return (validate.isAlpha(value))
  else if (key === "Password")
    return (validate.isStrongPassword(value,{
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }))
  return (false)
}

module.exports = validator