const validator = require('../models/validator.model')

/**
 * CHECK USER INPUT BY CHECKING KEYS AND VALIDATE VALUE BY VALIDATOR
 * RETURN ERROR
 **/
const checkUserInput = function (inputs,properties) {
  if (inputs instanceof Object)
  {
    for (const key of Object.keys(properties))
      if (properties.indexOf(key) === -1)
        return ("Error missing some inputs")
    for (const [key,value] of Object.entries(inputs))
      if (!validator(key,value))
        return (`Error ${key} is wrong`)
    return ("")
  }
  return ("Error all inputs wrong")
}

module.exports = {
  checkUserInput
}