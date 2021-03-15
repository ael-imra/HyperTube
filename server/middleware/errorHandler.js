const errorHandler = function (err, req, res, next) {
    if (err)
        res.send({
            type: 'error',
            status: 403,
            body: { Eng: 'Something wrong please try again', Fr: 'Un problème est survenu, veuillez réessayer' },
        });
    else next();
};
module.exports = errorHandler;
