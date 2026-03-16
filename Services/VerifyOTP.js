const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const connection = require("../connection/connection")
const { sendEmail } = require("../services/emailService")
const { generateWelcomeEmail } = require("../templates/email")
const verifyOTP = async (req, res) => {

    const { otp, signup_token } = req.body;

    try {

        const decoded = jwt.verify(signup_token, process.env.JWT_SECRET);


        if (decoded.otp.toString() !== otp.toString()) {
            return res.status(400).json({
                error: "Invalid OTP"
            });
        }

       
        const role_id = 3;

        const insertUserQuery = `
        INSERT INTO users 
        (first_name, last_name, email, password_hash, date_of_birth, gender, phone, role_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(
            insertUserQuery,
            [
                decoded.first_name,
                decoded.last_name,
                decoded.email,
                decoded.password_hash,
                decoded.date_of_birth,
                decoded.gender,
                decoded.phone,
                role_id
            ],
            async (err, result) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: "Error creating user"
                    });
                }

                await sendEmail(
                    decoded.email,
                    "Welcome to ZoeVerse 🎉",
                    generateWelcomeEmail(decoded.first_name)
                );

                res.json({
                    message: "Account created successfully",
                    result
                });

            }
        );

    } catch (error) {
        console.error("JWT VERIFY ERROR", error);
        return res.status(400).json({
            error: "Invalid or expired signup token"
        });

    }
};
module.exports = { verifyOTP };