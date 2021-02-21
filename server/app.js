const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cors = require('cors')
const MySQLStore = require('express-mysql-session')(session)
const passport = require('./configs/passportConfig')
const { pool } = require('./controllers/mysqlController')
const authRoute = require('./routes/authRoute')
const oauthRoute = require('./routes/oauthRoute')
const profileRoute = require('./routes/profileRoute')
const commentRoute = require('./routes/commentRoute')
const authentication = require('./middleware/authentication')
const errorHandler = require('./middleware/errorHandler')
const { keys } = require('./configs/indexConfig')

const sessionStore = new MySQLStore(
	{
		connectionLimit: 1,
		checkExpirationInterval: 2147483647,
		expiration: 2147483647000,
		createDatabaseTable: true,
		schema: {
			tableName: 'LoginRequests',
			columnNames: {
				session_id: 'loginID',
				expires: 'expires',
				data: 'data',
			},
		},
	},
	pool
)
const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(
	session({
		key: 'session_id',
		secret: keys.sessionSecret,
		cookie: { secure: false, expires: 2147483647000 },
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
	})
)
app.use(passport.initialize())
app.use(passport.session())
app.use('/oauth', oauthRoute)
app.use('/auth', authRoute)
app.use('/profile', authentication, profileRoute)
app.use('/comment', authentication, commentRoute)
app.get('/', (req, res) => {
	if (req.isAuthenticated()) return res.send('Welcome LLLLLL')
	return res.redirect('/login')
})
app.get('/login', (req, res) => {
	if (!req.isAuthenticated()) {
		res.contentType('text/html')
		return res.sendFile(__dirname + '/public/index.html')
	}
	return res.redirect('/')
})
app.use(errorHandler)
module.exports = app
