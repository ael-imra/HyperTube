const express = require('express');
const passport = require(__dirname + '/../configs/passportConfig');
const { login, register, resetPassword, activeAccount, checkToken, updatePassword } = require(__dirname +
  '/../controllers/authController');

const authRoute = express.Router();
authRoute.get('/', (req, res) => {
  return res.send({
    isLogin: req.isAuthenticated(),
  });
});
authRoute.post('/login', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return passport.authenticate('local', async () => {
      return await login(req, res, next);
    })(req, res, next);
  }
  return res.redirect(process.env.CLIENT_HOST);
});
authRoute.post('/register', async (req, res, next) => {
  if (!req.isAuthenticated()) return await register(req, res, next);
  return res.redirect(process.env.CLIENT_HOST);
});
authRoute.post('/reset', resetPassword);
authRoute.post('/updatePassword', updatePassword);
authRoute.get('/active/:token', activeAccount);
authRoute.get('/check/:token', checkToken);

module.exports = authRoute;
