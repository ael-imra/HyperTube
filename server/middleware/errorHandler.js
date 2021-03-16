const errorHandler = function (err, req, res, next) {
<<<<<<< HEAD
  console.log(err);
  if (err)
    res.send({
      type: "error",
      status: 403,
      body: "Something wrong please try again",
    });
  else next();
=======
    if (err)
        res.send({
            type: 'error',
            status: 403,
            body: { Eng: 'Something wrong please try again', Fr: 'Un problème est survenu, veuillez réessayer' },
        });
    else next();
>>>>>>> master
};
module.exports = errorHandler;
