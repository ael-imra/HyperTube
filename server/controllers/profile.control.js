const {checkUserInput} = require(__dirname+"/../services/user.service")
const {getUser,updateUser} = require(__dirname+"/../models/user.model")

const getMyProfile = async function (req,res,next){
    try{
        const user = await getUser({userID:req.user},["userName","email","firstName","lastName","image"])
        return res.send({
            type: "Success",
            status: 200,
            body: user,
        })
    }catch(err){next(err)}
}
const getProfile = async function (req,res,next){
    try{
        const error = await checkUserInput(req.params,["userName"])
        if (error)
            return res.send({
                type: "Error",
                status: 400,
                body: error,
            })
        const user = await getUser({userName:req.params.userName},["userName","firstName","lastName","image"])
        if (user)
            return res.send({
                type: "Success",
                status: 200,
                body: user,
            })
        return res.send({
            type: "Warn",
            status: 400,
            body: "Profile not found",
        })
    }catch(err){next(err)}
}
const editProfile = async function (req,res,next){
    try{
        const error = await checkUserInput(req.body,["userName","email","firstName","lastName"])
        if (error)
            return res.send({
                type: "Error",
                status: 400,
                body: error,
            })
        const resultUpdate = await updateUser({userID:req.user},req.body)
        if (resultUpdate)
            return res.send({
                type: "Success",
                status: 200,
                body: "Updated successful",
            })
        return res.send({
            type: "Error",
            status: 403,
            body: "Update failed",
        })
    }catch(err){next(err)}
}

module.exports = {
    getMyProfile,
    getProfile,
    editProfile
}