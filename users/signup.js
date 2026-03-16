const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connection = require("../connection/connection");

const { sendEmail } = require("../services/emailService");
const { generateOTP } = require("../Services/OTPLogic");

const { generateOTPEmail, generateWelcomeEmail } = require("../templates/email");

const Onboarding = async (req, res) => {
  const { first_name, last_name, email, password, date_of_birth, gender, phone } = req.body;

  if (!first_name || !last_name || !email || !password || !date_of_birth || !gender) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const checkEmailQuery = "SELECT id FROM users WHERE email = ?";
  connection.query(checkEmailQuery, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (results.length > 0) return res.status(409).json({ error: "Email already exists" });

    // Generate OTP
    const otp = generateOTP();

    // Hash password immediately
    const hashedPassword = await bcrypt.hash(password, 10);

    // Send OTP email
    await sendEmail(email, "Your ZoeVerse Verification Code", generateOTPEmail(first_name, otp));

    // Create JWT including hashed password
    const signup_token = jwt.sign(
      { first_name, last_name, email, password_hash: hashedPassword, date_of_birth, gender, otp, phone },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.json({
      message: "OTP sent successfully",
      signup_token
    });
  });
};
module.exports = { Onboarding };