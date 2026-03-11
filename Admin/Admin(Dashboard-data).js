const connection = require('../connection/connection');

// 1. Overview stats
const getSuperAdminOverview = (req, res) => {
    const queries = {
        total_users: `SELECT COUNT(*) AS total FROM users`,
        total_hospital_admins: `SELECT COUNT(*) AS total FROM hospital_admins`,
        total_facilities: `SELECT COUNT(*) AS total FROM facilities`,
        total_providers: `SELECT COUNT(*) AS total FROM providers`,
        total_reviews: `SELECT COUNT(*) AS total FROM reviews`,
        pending_reviews: `SELECT COUNT(*) AS total FROM reviews WHERE status = 'pending'`,
        flagged_reviews: `SELECT COUNT(*) AS total FROM reviews WHERE status = 'flagged'`,
        pending_facility_verifications: `SELECT COUNT(*) AS total FROM facility_verifications WHERE status = 'pending'`,
        pending_provider_verifications: `SELECT COUNT(*) AS total FROM provider_verifications WHERE status = 'pending'`,
        open_review_reports: `SELECT COUNT(*) AS total FROM review_reports WHERE status = 'open'`,
        unresolved_errors: `SELECT COUNT(*) AS total FROM error_logs WHERE resolved = FALSE`
    };

    const results = {};
    const keys = Object.keys(queries);
    let completed = 0;
    let hasResponded = false;

    keys.forEach((key) => {
        connection.query(queries[key], (err, queryResult) => {
            if (hasResponded) return;

            if (err) {
                hasResponded = true;
                console.log(`❌ Error fetching ${key}: ${err}`);
                return res.status(500).json({
                    error: `An error occurred while fetching ${key}`
                });
            }

            results[key] = queryResult[0].total;
            completed++;

            if (completed === keys.length) {
                return res.status(200).json({
                    message: 'Super admin overview fetched successfully',
                    overview: results
                });
            }
        });
    });
};

// 2. Get all users + search + filter by status
const getAllUsers = (req, res) => {
    const { search, status } = req.query;

    let sql = `
        SELECT 
            id,
            role_id,
            first_name,
            last_name,
            email,
            date_of_birth,
            profile_image_url,
            gender,
            is_verified,
            status,
            created_at
        FROM users
        WHERE 1=1
    `;

    let params = [];

    if (search) {
        sql += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }

    if (status) {
        sql += ` AND status = ?`;
        params.push(status);
    }

    sql += ` ORDER BY created_at DESC`;

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.log(`❌ Error fetching users: ${err}`);
            return res.status(500).json({
                error: 'An error occurred while fetching users'
            });
        }

        return res.status(200).json({
            message: 'Users fetched successfully',
            count: results.length,
            users: results
        });
    });
};

// 3. Latest reviews
const getLatestReviews = (req, res) => {
    const sql = `
        SELECT 
            r.id,
            r.title,
            r.comment,
            r.overall_rating,
            r.status,
            r.created_at,
            u.first_name,
            u.last_name,
            f.name AS facility_name,
            CONCAT(p.first_name, ' ', p.last_name) AS provider_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN facilities f ON r.facility_id = f.id
        LEFT JOIN providers p ON r.provider_id = p.id
        ORDER BY r.created_at DESC
        LIMIT 10
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(`❌ Error fetching latest reviews: ${err}`);
            return res.status(500).json({
                error: 'An error occurred while fetching latest reviews'
            });
        }

        return res.status(200).json({
            message: 'Latest reviews fetched successfully',
            reviews: results
        });
    });
};

// 4. Latest facilities
const getLatestFacilities = (req, res) => {
    const sql = `
        SELECT 
            id,
            name,
            facility_type,
            email,
            phone,
            city,
            state,
            is_verified,
            is_active,
            average_rating,
            trust_score,
            total_reviews,
            created_at
        FROM facilities
        ORDER BY created_at DESC
        LIMIT 10
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(`❌ Error fetching latest facilities: ${err}`);
            return res.status(500).json({
                error: 'An error occurred while fetching latest facilities'
            });
        }

        return res.status(200).json({
            message: 'Latest facilities fetched successfully',
            facilities: results
        });
    });
};

// 5. Pending verifications
const getPendingVerifications = (req, res) => {
    const facilityVerificationQuery = `
        SELECT 
            fv.id,
            fv.status,
            fv.submitted_at,
            f.id AS facility_id,
            f.name AS facility_name
        FROM facility_verifications fv
        INNER JOIN facilities f ON fv.facility_id = f.id
        WHERE fv.status = 'pending'
        ORDER BY fv.submitted_at DESC
    `;

    const providerVerificationQuery = `
        SELECT 
            pv.id,
            pv.status,
            pv.submitted_at,
            p.id AS provider_id,
            CONCAT(p.first_name, ' ', p.last_name) AS provider_name
        FROM provider_verifications pv
        INNER JOIN providers p ON pv.provider_id = p.id
        WHERE pv.status = 'pending'
        ORDER BY pv.submitted_at DESC
    `;

    connection.query(facilityVerificationQuery, (facilityErr, facilityResults) => {
        if (facilityErr) {
            console.log(`❌ Error fetching facility verifications: ${facilityErr}`);
            return res.status(500).json({
                error: 'An error occurred while fetching facility verifications'
            });
        }

        connection.query(providerVerificationQuery, (providerErr, providerResults) => {
            if (providerErr) {
                console.log(`❌ Error fetching provider verifications: ${providerErr}`);
                return res.status(500).json({
                    error: 'An error occurred while fetching provider verifications'
                });
            }

            return res.status(200).json({
                message: 'Pending verifications fetched successfully',
                facility_verifications: facilityResults,
                provider_verifications: providerResults
            });
        });
    });
};

// 6. Open review reports
const getOpenReviewReports = (req, res) => {
    const sql = `
        SELECT 
            rr.id,
            rr.reason,
            rr.details,
            rr.status,
            rr.created_at,
            r.id AS review_id,
            r.comment,
            r.overall_rating,
            u.first_name,
            u.last_name
        FROM review_reports rr
        INNER JOIN reviews r ON rr.review_id = r.id
        INNER JOIN users u ON rr.reported_by = u.id
        WHERE rr.status = 'open'
        ORDER BY rr.created_at DESC
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(`❌ Error fetching open review reports: ${err}`);
            return res.status(500).json({
                error: 'An error occurred while fetching open review reports'
            });
        }

        return res.status(200).json({
            message: 'Open review reports fetched successfully',
            reports: results
        });
    });
};

// 7. Recent activity
const getRecentActivity = (req, res) => {
    const sql = `
        SELECT 
            id,
            user_id,
            action,
            entity_type,
            entity_id,
            details,
            created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT 20
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(`❌ Error fetching recent activity: ${err}`);
            return res.status(500).json({
                error: 'An error occurred while fetching recent activity'
            });
        }

        return res.status(200).json({
            message: 'Recent activity fetched successfully',
            activities: results
        });
    });
};

// 8. Unresolved errors
const getUnresolvedErrors = (req, res) => {
    const sql = `
        SELECT 
            id,
            message,
            route,
            method,
            status_code,
            request_id,
            environment,
            severity,
            resolved,
            created_at
        FROM error_logs
        WHERE resolved = FALSE
        ORDER BY created_at DESC
        LIMIT 20
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(`❌ Error fetching unresolved errors: ${err}`);
            return res.status(500).json({
                error: 'An error occurred while fetching unresolved errors'
            });
        }

        return res.status(200).json({
            message: 'Unresolved errors fetched successfully',
            errors: results
        });
    });
};

module.exports = {
    getSuperAdminOverview,
    getAllUsers,
    getLatestReviews,
    getLatestFacilities,
    getPendingVerifications,
    getOpenReviewReports,
    getRecentActivity,
    getUnresolvedErrors
};