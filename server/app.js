const express = require("express")
const session = require("express-session")
const bodyParser = require('body-parser')
const cors = require('cors')
const MySQLStore = require("express-mysql-session")(session)
const passport = require("./configs/passport.config")
const { pool } = require("./controllers/mysql.control")
const authRoute = require("./routes/auth.route")
const oauthRoute = require("./routes/oauth.route")
const profileRoute = require('./routes/profile.route')
const authentication = require('./middleware/authentication')
const errorHandler = require('./middleware/errorHandler')
const { keys } = require("./configs/index.config")

const sessionStore = new MySQLStore(
    {
        connectionLimit: 1,
        checkExpirationInterval: 900000,
        expiration: 86400000,
        createDatabaseTable: true,
        schema: {
            tableName: "LoginRequests",
            columnNames: {
                session_id: "loginID",
                expires: "expires",
                data: "data",
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
        key: "session_id",
        secret: keys.sessionSecret,
        cookie: { maxAge: 3600000, secure: false },
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use("/oauth", oauthRoute)
app.use("/auth", authRoute)
app.use('/profile',authentication,profileRoute)
app.get("/", (req, res) => {
    if (req.isAuthenticated()) return res.send("Welcome LLLLLL")
    return res.redirect("/login")
})
app.get("/login", (req, res) => {
    if (!req.isAuthenticated()) {
        res.contentType("text/html")
        return res.sendFile(__dirname + "/public/index.html")
    }
    return res.redirect("/")
})
app.use(errorHandler)
module.exports = app