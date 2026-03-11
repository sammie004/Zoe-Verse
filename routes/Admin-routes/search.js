const express = require("express")
const router = express.Router()
// the in-code dependecies
const{     getSuperAdminOverview,getAllUsers, getLatestReviews, getLatestFacilities, getPendingVerifications, getOpenReviewReports, getRecentActivity,getUnresolvedErrors } = require("../../Admin/Admin(Dashboard-data)")

// actual routes
router.get('/super-admin/dashboard/overview', getSuperAdminOverview);
router.get('/super-admin/users', getAllUsers);
router.get('/super-admin/dashboard/reviews/latest', getLatestReviews);
router.get('/super-admin/dashboard/facilities/latest', getLatestFacilities);
router.get('/super-admin/dashboard/verifications/pending', getPendingVerifications);
router.get('/super-admin/dashboard/review-reports/open', getOpenReviewReports);
router.get('/super-admin/dashboard/activity/recent', getRecentActivity);
router.get('/super-admin/dashboard/errors/unresolved', getUnresolvedErrors);

module.exports = router