// calculation of the trust score based off the rubric provided by the client
// services/trustScoreEngine.js

const calculateClinicalTrust = (review) => {
    const safetyPts = ((review.d_safety || 0) / 5) * 15;

    const communicationPts = ((review.d_communication || 0) / 5) * 5;
    const doctorCommPts = ((review.d_doctor_comm || 0) / 5) * 5;

    const outcomePts = ((review.d_outcome_conf || 0) / 5) * 5;

    return safetyPts + communicationPts + doctorCommPts + outcomePts;
};


const calculatePatientExperience = (review) => {
    const staffPts = ((review.d_staff_attitude || 0) / 5) * 10;
    const waitPts = ((review.d_wait_time || 0) / 5) * 8;
    const cleanPts = ((review.d_cleanliness || 0) / 5) * 5;

    return staffPts + waitPts + cleanPts;
};


const calculateFinancialIntegrity = (review) => {
    const costPts = ((review.d_cost_clarity || 0) / 5) * 12;

    let surpriseModifier = 0;

    if (review.d_surprise_charge === 'no') surpriseModifier = 5;
    if (review.d_surprise_charge === 'yes') surpriseModifier = -5;

    return Math.max(0, costPts + surpriseModifier);
};


const calculateHolisticRating = (review) => {
    return ((review.overall_rating || 0) / 5) * 20;
};


const calculateContextualQuality = (review) => {

    let visitTypePts = 0;

    if (review.visit_type === 'inpatient') visitTypePts = 2.5;
    if (review.visit_type === 'outpatient') visitTypePts = 1.5;
    if (review.visit_type === 'emergency') visitTypePts = 2;
    if (review.visit_type === 'telehealth') visitTypePts = 1;

    let recencyPts = 0;

    switch (review.visit_recency) {
        case 'within_week':
            recencyPts = 3;
            break;
        case 'within_month':
            recencyPts = 2.5;
            break;
        case 'within_3_months':
            recencyPts = 2;
            break;
        case 'within_6_months':
            recencyPts = 1;
            break;
        default:
            recencyPts = 0.5;
    }

    return visitTypePts + recencyPts;
};


const calculateReviewTrustScore = (review) => {

    const clinical = calculateClinicalTrust(review);
    const experience = calculatePatientExperience(review);
    const financial = calculateFinancialIntegrity(review);
    const holistic = calculateHolisticRating(review);
    const contextual = calculateContextualQuality(review);

    const totalScore =
        clinical +
        experience +
        financial +
        holistic +
        contextual;

    return {
        clinical,
        experience,
        financial,
        holistic,
        contextual,
        totalScore
    };
};


module.exports = {
    calculateReviewTrustScore
};