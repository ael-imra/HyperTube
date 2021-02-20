/**
 * CREATE TOKEN DEPANDINE ON LENGTH AND CONVERT IT INTO BASE64
 **/
const generateToken = function (lengthChar) {
    const allChar = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~"
    let token = ""
    for (let i = 0; i < lengthChar; i++) {
        const random = Math.floor(Math.random() * allChar.length)
        token += allChar[random]
    }
    token = Buffer.from(token)
    return token.toString("base64")
}

module.exports = {
    generateToken,
}