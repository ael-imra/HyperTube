const user = require('../models/user.model')
const profile = require('../models/profile.model')
const mysql = require('../models/mysql.model')


/**
 * INITIAL LOCAL VARIABLE ON EXPRESS APP
 **/
const init = function (app){
  const allModels = { ...user, ...profile,...mysql }
  for (const [key, value] of Object.entries(allModels))
    app.locals[key] = value
}

module.exports = init