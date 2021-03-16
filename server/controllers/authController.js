const { checkUserInput } = require(__dirname + '/../services/userService');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { getJWT } = require('../services/userService');
const { sendMail } = require(__dirname + '/../helper/mailHelper');
const { getUser, insertLocalUser, updateUser, checkUserExist } = require(__dirname + '/../models/userModel');
const { clientPort } = require(__dirname + '/../configs/indexConfig');

const register = async function (req, res, next) {
    try {
        const error = checkUserInput(req.body, ['email', 'userName', 'lastName', 'firstName', 'password']);
        if (error)
            return res.send({
                type: 'error',
                status: 400,
                body: error,
            });
        const { userName, email, password } = req.body;
        const checkResult = await checkUserExist(userName, email);
        if (!checkResult) {
            const token = crypto.randomUUID();
            sendMail('active', email, userName, `http://localhost:1337/auth/active`, token);
            req.body.password = await bcrypt.hash(password, 5);
            const insertSuccessful = await insertLocalUser({ ...req.body, userFrom: 'local', token });
            if (insertSuccessful)
                return res.send({
                    type: 'success',
                    status: 200,
                    body: { Eng: 'Registration successful', Fr: 'Inscription réussi' },
                });
            return res.send({
                type: 'error',
                status: 400,
                body: { Eng: 'Registration Failed', Fr: "Échec de l'enregistrement" },
            });
        }
        return res.send({
            type: 'warning',
            status: 403,
            body: { Eng: `${checkResult} already exist`, Fr: `${checkResult} existe déjà` },
        });
    } catch (err) {
        next(err);
    }
};

const login = async function (req, res, next) {
    try {
        const error = checkUserInput(req.body, ['userName', 'password']);
        if (error)
            return res.send({
                type: 'error',
                status: 400,
                body: error,
            });
        const { userName, password } = req.body;
        const user = await getUser({ userName: userName }, ['userID', 'password', 'isActive']);
        if (user) {
            if (user.userID.indexOf('go') > -1 || user.userID.indexOf('gi') > -1 || user.userID.indexOf('42') > -1)
                return res.send({
                    type: 'warning',
                    status: 403,
                    body: { Eng: "You can't login with this username", Fr: "Vous ne pouvez pas vous connecter avec ce nom d'utilisateur" },
                });
            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword)
                return res.send({
                    type: 'error',
                    status: 401,
                    body: { Eng: 'Incorrect password', Fr: 'Mot de passe incorrect' },
                });
            if (user.isActive) {
                const jwt = await getJWT(user.userID);
                res.cookie('jwtToken', jwt, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false });
                return res.send({
                    type: 'success',
                    status: 200,
                    body: { Eng: 'user authenticated', Fr: 'utilisateur authentifié' },
                });
            } else if (user.isActive === 0)
                return res.send({
                    type: 'warning',
                    status: 403,
                    body: { Eng: 'You must activate the account', Fr: 'Vous devez activer le compte' },
                });
        }
        return res.send({
            type: 'error',
            status: 401,
            body: { Eng: 'Incorrect userName or password', Fr: 'Identifiant ou mot de passe incorrect' },
        });
    } catch (err) {
        next(err);
    }
};

const resetPassword = async function (req, res, next) {
    try {
        const error = checkUserInput(req.body, ['email']);
        if (error)
            return res.send({
                type: 'error',
                status: 400,
                body: error,
            });
        const { email } = req.body;
        const user = await getUser({ email }, ['userFrom', 'userName', 'isActive', 'token']);
        if (user & (user.userFrom !== 'local'))
            return res.send({
                type: 'error',
                status: 403,
                body: { Eng: 'Cannot reset password for this account', Fr: 'Impossible de réinitialiser le mot de passe pour ce compte' },
            });
        if (user) {
            if (!user.isActive)
                return res.send({
                    type: 'error',
                    status: 403,
                    body: { Eng: 'Active your account than reset password', Fr: 'Activez votre compte plutôt que de réinitialiser le mot de passe' },
                });
            sendMail('reset', email, user.userName, `http://localhost:${clientPort}/ResetPassword`, user.token);
            return res.send({
                type: 'success',
                status: 200,
                body: { Eng: 'Check your email to reset password', Fr: 'Vérifiez votre e-mail pour réinitialiser le mot de passe' },
            });
        }
        return res.send({
            type: 'error',
            status: 400,
            body: { Eng: 'Invalid token', Fr: 'Jeton invalide' },
        });
    } catch (err) {
        next(err);
    }
};
const updatePassword = async function (req, res, next) {
    try {
        const { token, newPassword } = req.body;
        const tokenError = checkUserInput({ token }, ['token']);
        const newPasswordError = checkUserInput({ password: newPassword }, ['password']);
        if (tokenError || newPasswordError)
            return res.send({
                type: 'error',
                status: 400,
                body: tokenError || newPasswordError,
            });
        const user = await getUser({ token }, ['userID']);
        if (user && user.userID) {
            updateUser(user.userID, { password: await bcrypt.hash(newPassword, 5), token: crypto.randomUUID() });
            return res.send({
                type: 'success',
                status: 200,
                body: { Eng: 'Updated successful', Fr: 'Mise à jour réussie' },
            });
        }
        return res.send({
            type: 'error',
            status: 400,
            body: { Eng: 'Invalid token', Fr: 'Jeton invalide' },
        });
    } catch (err) {
        next(err);
    }
};
const activeAccount = async function (req, res, next) {
    try {
        const error = checkUserInput(req.params, ['token']);
        if (error)
            return res.send({
                type: 'error',
                status: 400,
                body: error,
            });
        const { token } = req.params;
        const user = await getUser({ token }, 'userID');
        if (user) {
            const token = crypto.randomUUID();
            updateUser(user.userID, { token, isActive: 1 });
            return res.redirect(`http://localhost:${clientPort}/success`);
        }
        return res.redirect(`http://localhost:${clientPort}/failed`);
    } catch (err) {
        next(err);
    }
};
const checkToken = async function (req, res, next) {
    try {
        const error = checkUserInput(req.params, ['token']);
        if (error)
            return res.send({
                type: 'error',
                status: 400,
                body: error,
            });
        const { token } = req.params;
        const user = await getUser({ token }, 'userID');
        if (user)
            return res.send({
                type: 'success',
                status: 200,
                body: true,
            });
        return res.send({
            type: 'error',
            status: 200,
            body: false,
        });
    } catch (err) {
        next(err);
    }
};
module.exports = {
    register,
    login,
    resetPassword,
    updatePassword,
    activeAccount,
    checkToken,
};
