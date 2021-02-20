const authentication = function (req,res,next){
    if (req.isAuthenticated())
        return next()
    return res.send({
        type: "Error",
        status: 401,
        body: "Unauthorized",
    })
}
module.exports = authentication