const connection = require('../connection/connection');
const bcrypt = require('bcrypt');

const Onboarding = (req, res) => {
    const {
        first_name,
        last_name,
        email,
        password,
        date_of_birth,
        profile_image_url,
        gender
    } = req.body;

    // Basic validation
    if (!first_name || !last_name || !email || !password || !date_of_birth || !gender) {
        return res.status(400).json({ error: 'first_name, last_name, email, password, date_of_birth, and gender are required' });
    }

    // Default values controlled by backend
    const is_verified = false;
    const status = 'active';
    const role_id = 3; // assuming 3 = patient based on your seed data

    const checkEmailQuery = 'SELECT id FROM users WHERE email = ?';

    connection.query(checkEmailQuery, [email], async (err, results) => {
        if (err) {
            console.log(`❌ Error checking existing email: ${err}`);
            return res.status(500).json({ error: 'An error occurred while checking email' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const insertUserQuery = `
                INSERT INTO users 
                (role_id, first_name, last_name, email, password_hash, date_of_birth, profile_image_url, gender, is_verified, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            connection.query(
                insertUserQuery,
                [
                    role_id,
                    first_name,
                    last_name,
                    email,
                    hashedPassword,
                    date_of_birth,
                    profile_image_url || null,
                    gender,
                    is_verified,
                    status
                ],
                (err, results) => {
                    if (err) {
                        console.log(`❌ Error inserting new user: ${err}`);
                        return res.status(500).json({ error: 'An error occurred while creating user' });
                    }

                    return res.status(201).json({
                        message: 'User registered successfully',
                        user: {
                            id: results.insertId,
                            first_name,
                            last_name,
                            email,
                            role_id,
                            is_verified,
                            status
                        }
                    });
                }
            );
        } catch (hashError) {
            console.log(`❌ Error hashing password: ${hashError}`);
            return res.status(500).json({ error: 'An error occurred while securing password' });
        }
    });
};

module.exports = { Onboarding };