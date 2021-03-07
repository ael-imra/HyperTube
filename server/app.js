const express = require('express')
// const session = require('express-session')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
// const MySQLStore = require('express-mysql-session')(session)
const passport = require('./configs/passportConfig')
// const { pool } = require('./services/mysqlService')
const authRoute = require('./routes/authRoute')
const oauthRoute = require('./routes/oauthRoute')
const profileRoute = require('./routes/profileRoute')
const commentRoute = require('./routes/commentRoute')
const favoriteRoute = require('./routes/favoriteRoute')
const movieRoute = require('./routes/movieRoute')
const subtitleRoute = require('./routes/subtitleRoute')
const { authentication, jwt } = require('./middleware/authentication')
const errorHandler = require('./middleware/errorHandler')
const { keys } = require('./configs/indexConfig')
// const cron = require('./configs/cron')

// const sessionStore = new MySQLStore(
// 	{
// 		connectionLimit: 1,
// 		checkExpirationInterval: 2147483647,
// 		expiration: 2147483647000,
// 		createDatabaseTable: true,
// 		schema: {
// 			tableName: 'LoginRequests',
// 			columnNames: {
// 				session_id: 'loginID',
// 				expires: 'expires',
// 				data: 'data',
// 			},
// 		},
// 	},
// 	pool
// )
const app = express()
// cron()
app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())
// app.use(
// 	session({
// 		key: 'session_id',
// 		secret: keys.sessionSecret,
// 		cookie: { secure: false, expires: 2147483647000 },
// 		store: sessionStore,
// 		resave: false,
// 		saveUninitialized: false,
// 	})
// )
app.use((req, res, next) => {
	console.log('OKKOK')
	next()
})
app.use(jwt)
app.use(passport.initialize())
// app.use(passport.session())
app.use('/oauth', oauthRoute)
app.use('/auth', authRoute)
app.use('/profile', authentication, profileRoute)
app.use('/comment', authentication, commentRoute)
app.use('/favorite', authentication, favoriteRoute)
app.use('/movie', authentication, movieRoute)
app.use('/subtitle', authentication, subtitleRoute)
app.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		res.type('.html')
		return res.sendFile(__dirname + '/public/index.html')
	}
	return res.redirect('/login')
})
app.get('/login', (req, res) => {
	if (!req.isAuthenticated()) {
		res.type('.html')
		return res.sendFile(__dirname + '/public/login.html')
	}
	return res.redirect('/')
})
app.use(errorHandler)
module.exports = app
