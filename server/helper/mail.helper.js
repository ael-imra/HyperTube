const nodemailer = require("nodemailer")
const { mail_config } = require(__dirname+"/../configs/index.config")
const mailContent = require(__dirname+"/../services/mail.service")

const transporter = nodemailer.createTransport(mail_config)
const sendMailPromise = function (mailOptions) {
    return new Promise((resolve) => transporter.sendMail(mailOptions, (error, info) => resolve({ error, info })))
}
const sendMail = async function (subject, email, userName, url,token) {
    const mailOptions = {
        from: mail_config.auth.user,
        to: email,
        subject: subject,
        html: await mailContent(userName, subject, url,token),
    }
    return await sendMailPromise(mailOptions)
}
module.exports = {
    sendMail,
}
