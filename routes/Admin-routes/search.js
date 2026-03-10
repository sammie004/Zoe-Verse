const express = require("express")
const router = express.Router()
// the in-code dependecies
const{ SearchUsers, getAllUsers, FilterUsers } = require("../../Admin/admin-filter")

router.get('/users', getAllUsers)
router.get('/users/search', SearchUsers)
router.get('/users/filter', FilterUsers)

module.exports = router