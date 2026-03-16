const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    return transporter.sendMail({
        from: `"ZoeVerse" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html
    });
};

module.exports = { sendEmail };