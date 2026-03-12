const connection = require('../connection/connection');
const { calculateReviewTrustScore } = require('../services/trustScoreEngine');

const createReview = (req, res) => {

    const reviewData = req.body;

    const trustScore = calculateReviewTrustScore(reviewData);

    const sql = `
        INSERT INTO reviews (
            user_id,
            provider_id,
            facility_id,
            title,
            comment,
            overall_rating,
            visit_type,
            visit_recency,
            recommendation,
            d_wait_time,
            d_staff_attitude,
            d_cost_clarity,
            d_surprise_charge,
            d_cleanliness,
            d_communication,
            d_doctor_seen,
            d_doctor_comm,
            d_doctor_rushed,
            d_safety,
            d_outcome_conf,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const values = [
        reviewData.user_id,
        reviewData.provider_id,
        reviewData.facility_id,
        reviewData.title,
        reviewData.comment,
        reviewData.overall_rating,
        reviewData.visit_type,
        reviewData.visit_recency,
        reviewData.recommendation,
        reviewData.d_wait_time,
        reviewData.d_staff_attitude,
        reviewData.d_cost_clarity,
        reviewData.d_surprise_charge,
        reviewData.d_cleanliness,
        reviewData.d_communication,
        reviewData.d_doctor_seen,
        reviewData.d_doctor_comm,
        reviewData.d_doctor_rushed,
        reviewData.d_safety,
        reviewData.d_outcome_conf
    ];

    connection.query(sql, values, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Error creating review"
            });
        }

        return res.status(201).json({
            message: "Review submitted successfully",
            trust_breakdown: trustScore
        });
    });

};

module.exports = {
    createReview
};