const express = require('express')
const router = express.Router();

// Importing the signup controller
const { Onboarding } = require('../../user Authentication/signup');
const {Login} = require('../../user Authentication/Login')

// Define the route for user login
router.post('/login', Login)
// Define the route for user registration
router.post('/signup', Onboarding);
module.exports = router;

