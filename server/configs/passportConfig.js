const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const GitHubStrategy = require("passport-github2").Strategy
const FortyTwoStrategy = require("passport-42").Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy
const { getUser, insertUser } = require(__dirname+"/../models/userModel")
const { keys, host } = require("./indexConfig")
const {generateToken} = require(__dirname+"/../helper/indexHelper")

passport.use(
    new LocalStrategy(
        {
            userNameField: "userName",
            passwordField: "password",
        },
        (userName, password, done) => {
            done(null, { userName, password })
        }
    )
)
passport.use(
    new GitHubStrategy(
        {
            clientID: keys.github.clientID,
            clientSecret: keys.github.clientSecret,
            callbackURL: `http://${host}:1337/oauth/github/callback`,
            scope: ["user:email"],
        },
        async function (accessToken, refreshToken, profile, done) {
            const user = await getUser({ githubID: profile.id }, "userID")
            if (user) return done(null, user.userID)
			if (profile && profile._json) {
				const token = generateToken(128)
	            const resultInsert = await insertUser({
	                githubID: profile.id,
	                userName: profile.username,
	                email: profile.emails[0].value,
	                image: profile._json.avatar_url,
	                firstName: profile._json.name ? profile._json.name : "avatar",
	                lastName: profile._json.name ? profile._json.name : "avatar",
					token
	            })
	            return done(null, resultInsert.insertId)
			}
			return done(null,false)
        }
    )
)
passport.use(
    new FortyTwoStrategy(
        {
            clientID: keys["42"].clientID,
            clientSecret: keys["42"].clientSecret,
            callbackURL: `http://${host}:1337/oauth/42/callback`,
        },
        async function (accessToken, refreshToken, profile, done) {
            const user = await getUser({ "42ID": profile.id }, "userID")
            if (user) return done(null, user.userID)
            if (profile && profile._json) {
				const token = generateToken(128)
                const resultInsert = await insertUser({
                    "42ID": profile._json.id,
                    userName: profile._json.login,
                    email: profile._json.email,
                    image: profile._json.image_url,
                    firstName: profile._json["first_name"],
                    lastName: profile._json["last_name"],
					token
                })
                return done(null, resultInsert.insertId)
            } else return done(null, false)
        }
    )
)
passport.use(
    new GoogleStrategy(
        {
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            callbackURL: `http://${host}:1337/oauth/google/callback`,
            scope: ["profile", "email"],
        },
        async function (accessToken, refreshToken, profile, done) {
            const user = await getUser({ googleID: profile.id }, "userID")
            if (user) return done(null, user.userID)
			if (profile && profile._json) {
				const token = generateToken(128)
	            const resultInsert = await insertUser({
	                googleID: profile.id,
	                userName: profile._json.name,
	                email: profile._json.email,
	                image: profile._json.picture,
	                firstName: profile._json["given_name"],
	                lastName: profile._json["given_name"],
					token
	            })
	            return done(null, resultInsert.insertId)
			}
			return done(null,false)
        }
    )
)
passport.serializeUser((userID, done) => {
    done(null, userID)
})

passport.deserializeUser(async (userID, done) => {
    const user = await getUser({ userID }, "userName")
    if (user) return done(null, userID)
    return done(null, false)
})

module.exports = passport
