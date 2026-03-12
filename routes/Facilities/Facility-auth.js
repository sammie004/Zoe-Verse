const express = require("express")
const router = express.Router()

    // in code dependencies
const { FacilityOnboarding, FacilityLogin } = require("../../Facilities/facility-admin-auth")
    
router.post('/onboarding', FacilityOnboarding)
router.post('/facility-login', FacilityLogin)

module.exports = router
