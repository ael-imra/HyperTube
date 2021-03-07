const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const FortyTwoStrategy = require('passport-42').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { getUser, insertUser, checkUserExist } = require(__dirname + '/../models/userModel')
const { keys, host } = require('./indexConfig')
const { generateToken } = require(__dirname + '/../helper/indexHelper')

passport.use(
	new LocalStrategy(
		{
			userNameField: 'userName',
			passwordField: 'password',
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
			scope: ['user:email'],
		},
		async function (accessToken, refreshToken, profile, done) {
			const user = await getUser({ githubID: profile.id }, 'githubID')
			if (user) return done(null, user.githubID)
			if (profile && profile._json && !(await checkUserExist(profile.username, profile.emails[0].value))) {
				const token = generateToken(128)
				const nameParts = profile._json.name ? profile._json.name.split(' ') : ['avatar']
				const firstName = nameParts[0]
				const lastName = nameParts.length > 1 ? profile._json.name.replace(nameParts[0], '').replaceAll(' ', '') : nameParts[0]
				const resultInsert = await insertUser({
					githubID: 'gi_' + profile.id,
					userName: profile.username,
					email: profile.emails[0].value,
					image: profile._json.avatar_url,
					firstName,
					lastName,
					token,
				})
				return done(null, resultInsert.insertId)
			}
			return done(null, false)
		}
	)
)
passport.use(
	new FortyTwoStrategy(
		{
			clientID: keys['42'].clientID,
			clientSecret: keys['42'].clientSecret,
			callbackURL: `http://${host}:1337/oauth/42/callback`,
		},
		async function (accessToken, refreshToken, profile, done) {
			const user = await getUser({ '42ID': profile.id }, '42ID')
			if (user) return done(null, user['42ID'])
			if (profile && profile._json && !(await checkUserExist(profile._json.login, profile._json.email))) {
				const token = generateToken(128)
				const resultInsert = await insertUser({
					'42ID': '42_' + profile._json.id,
					userName: profile._json.login,
					email: profile._json.email,
					image: profile._json.image_url,
					firstName: profile._json['first_name'],
					lastName: profile._json['last_name'],
					token,
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
			scope: ['profile', 'email'],
		},
		async function (accessToken, refreshToken, profile, done) {
			const user = await getUser({ googleID: profile.id }, 'googleID')
			if (user) return done(null, user.googleID)
			if (profile && profile._json && !(await checkUserExist(profile._json.name, profile._json.email))) {
				const token = generateToken(128)
				const nameParts = profile._json['given_name'].split(' ')
				const firstName = nameParts[0]
				const lastName = nameParts.length > 1 ? profile._json['given_name'].replace(nameParts[0], '').replaceAll(' ', '') : nameParts[0]
				const resultInsert = await insertUser({
					googleID: 'go_' + profile.id,
					userName: profile._json.name,
					email: profile._json.email,
					image: profile._json.picture,
					firstName,
					lastName,
					token,
				})
				return done(null, resultInsert.insertId)
			}
			return done(null, false)
		}
	)
)
passport.serializeUser((userID, done) => {
	done(null, userID)
})

passport.deserializeUser(async (userID, done) => {
	const user = await getUser({ userID }, 'userName')
	if (user) return done(null, userID)
	return done(null, false)
})

module.exports = passport
