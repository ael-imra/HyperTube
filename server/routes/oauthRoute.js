const express = require('express')
const passport = require(__dirname + '/../configs/passportConfig')
const oauthRoute = express.Router()

oauthRoute.get('/42', passport.authenticate('42'))
oauthRoute.get('/42/callback', (req, res, next) => {
	if (!req.isAuthenticated()) passport.authenticate('42', { failureRedirect: '/login', successRedirect: '/', session: true })(req, res, next)
	else res.redirect('/')
})

oauthRoute.get('/github', passport.authenticate('github'))
oauthRoute.get('/github/callback', (req, res, next) => {
	if (!req.isAuthenticated()) passport.authenticate('github', { failureRedirect: '/login', successRedirect: '/', session: true })(req, res, next)
	else res.redirect('/')
})

oauthRoute.get('/google', passport.authenticate('google'))
oauthRoute.get('/google/callback', (req, res, next) => {
	if (!req.isAuthenticated()) passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/', session: true })(req, res, next)
	else res.redirect('/')
})
module.exports = oauthRoute
