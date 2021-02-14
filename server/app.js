const app = require('express')()
const init = require('./config/init.config')
const { cors } = require('./api/middleware')
const user = require('./api/routes/user.route')
const profile = require('./api/routes/profile.route')

init(app)
app.use(cors)
app.use('/user',user)
app.use('/profile',profile)

module.exports = app