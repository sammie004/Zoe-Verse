const express = require("express")
const router = express.Router()

// middleware imports
const { authenticate, authorize } = require('../../middleware/auth-middleware')

// in code dependencies
const { createFacility } = require("../../Facilities/Create-facility")

// route for creating a facility, only accessible by facility admins
router.post('/create', authenticate, authorize(['facility_admin', 'manager', 'owner']), createFacility)

module.exports = router