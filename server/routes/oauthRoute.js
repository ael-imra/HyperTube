const express = require('express');
const { getJWT } = require('../services/userService');
const passport = require(__dirname + '/../configs/passportConfig');
const oauthRoute = express.Router();

const oauthResponse = (strategy) => (req, res, next) => {
  if (!req.isAuthenticated())
    return passport.authenticate(strategy, { session: false }, async (err, user) => {
      if (user) {
        jwt = await getJWT(user);
        return res.redirect(`${process.env.CLIENT_HOST}/token?jwt=${jwt}`);
      }
      return res.redirect(`${process.env.CLIENT_HOST}/login`);
    })(req, res, next);
  else res.redirect(process.env.CLIENT_HOST);
};

oauthRoute.get('/42', passport.authenticate('42'));
oauthRoute.get('/42/callback', oauthResponse('42'));

oauthRoute.get('/github', passport.authenticate('github'));
oauthRoute.get('/github/callback', oauthResponse('github'));

oauthRoute.get('/google', passport.authenticate('google'));
oauthRoute.get('/google/callback', oauthResponse('google'));

module.exports = oauthRoute;
