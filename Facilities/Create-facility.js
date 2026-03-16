// code for the creation of facilities by the facility admins
// linking to the connection setup
const connection = require('../connection/connection');

// actual code for creating a facility
const createFacility = (req, res) => {
    const {
        name,
        facility_type,
        description,
        email,
        phone,
        address,
        city,
        state,
        country,
        latitude,
        longitude,
        operating_hours
    } = req.body;

    const admin_id = req.user.id; // from authentication middleware

    if (!name || !facility_type) {
        return res.status(400).json({ error: 'Facility name and type are required' });
    }

    const sql = `
        INSERT INTO facilities
        (name, facility_type, description, email, phone, address, city, state, country, latitude, longitude, operating_hours, admin_id, is_verified, is_active, average_rating, trust_score, total_reviews, nps_score, clinical_score, experience_score, financial_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, 0, 0, 0, 0, 0, 0, 0)
    `;

    const values = [name, facility_type, description, email, phone, address, city, state, country, latitude, longitude, operating_hours, admin_id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error creating facility:', err);
            return res.status(500).json({ error: 'Failed to create facility' });
        }

        return res.status(201).json({ message: 'Facility created successfully', facility_id: result.insertId });
    });
};

// export function
module.exports = { createFacility }