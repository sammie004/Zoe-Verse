const express = require('express')
const router = express.Router();

// Importing the signup controller
const { Onboarding } = require('../../users/signup');
const { verifyOTP } = require('../../Services/VerifyOTP');
const {Login} = require('../../users/Login')

// Define the route for user login
router.post('/login', Login)
// Define the route for user registration
router.post('/verify-otp', verifyOTP);
router.post('/signup', Onboarding);
module.exports = router;

