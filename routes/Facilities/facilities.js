const express = require("express")
const router = express.Router()

// dependencies
const { fetch_facilities } = require("../../users/view-facilities")

router.get('/all-facilities', fetch_facilities)
module.exports = router