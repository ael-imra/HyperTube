const express = require('express')
const { getJWT } = require('../services/userService')
const passport = require(__dirname + '/../configs/passportConfig')
const oauthRoute = express.Router()

oauthRoute.get('/42', passport.authenticate('42'))
oauthRoute.get('/42/callback', (req, res, next) => {
	if (!req.isAuthenticated())
		passport.authenticate('42', {}, async (err, user) => {
			if (user) {
				const jwt = await getJWT(user)
				res.cookie('jwtToken', jwt)
				return res.redirect('/')
			}
			return res.redirect('/login')
		})(req, res, next)
	else res.redirect('/')
})

oauthRoute.get('/github', passport.authenticate('github'))
oauthRoute.get('/github/callback', (req, res, next) => {
	if (!req.isAuthenticated())
		passport.authenticate('github', {}, async (err, user) => {
			if (user) {
				const jwt = await getJWT(user)
				res.cookie('jwtToken', jwt)
				return res.redirect('/')
			}
			return res.redirect('/login')
		})(req, res, next)
	else res.redirect('/')
})

oauthRoute.get('/google', passport.authenticate('google'))
oauthRoute.get('/google/callback', (req, res, next) => {
	if (!req.isAuthenticated())
		passport.authenticate('google', {}, async (err, user) => {
			if (user) {
				const jwt = await getJWT(user)
				res.cookie('jwtToken', jwt)
				return res.redirect('/')
			}
			return res.redirect('/login')
		})(req, res, next)
	else res.redirect('/')
})
module.exports = oauthRoute
