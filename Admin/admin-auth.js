const connection = require('../connection/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const registerHospitalAdmin = async (req, res) => {
    const {
        first_name,
        last_name,
        username,
        email,
        phone,
        password,
        profile_image_url,
        gender
    } = req.body;

    if (!first_name || !last_name || !username || !email || !password) {
        return res.status(400).json({
            error: 'first_name, last_name, username, email, and password are required'
        });
    }

    const checkAdminQuery = `
        SELECT id
        FROM hospital_admins
        WHERE email = ? OR username = ?
    `;

    connection.query(checkAdminQuery, [email, username], async (err, results) => {
        if (err) {
            console.log(`❌ Error checking hospital admin: ${err}`);
            return res.status(500).json({
                error: 'An error occurred while checking admin details'
            });
        }

        if (results.length > 0) {
            return res.status(409).json({
                error: 'This Admin already exists'
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const insertAdminQuery = `
                INSERT INTO hospital_admins (
                    facility_id,
                    first_name,
                    last_name,
                    username,
                    email,
                    phone,
                    password_hash,
                    profile_image_url,
                    gender,
                    is_verified,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            connection.query(
                insertAdminQuery,
                [
                    null,
                    first_name,
                    last_name,
                    username,
                    email,
                    phone || null,
                    hashedPassword,
                    profile_image_url || null,
                    gender || null,
                    false,
                    'active'
                ],
                (err, results) => {
                    if (err) {
                        console.log(`❌ Error creating hospital admin: ${err}`);
                        return res.status(500).json({
                            error: 'An error occurred while creating hospital admin'
                        });
                    }

                    return res.status(201).json({
                        message: 'Hospital admin registered successfully',
                        admin: {
                            id: results.insertId,
                            first_name,
                            last_name,
                            username,
                            email,
                            facility_id: null
                        }
                    });
                }
            );
        } catch (hashError) {
            console.log(`❌ Error hashing password: ${hashError}`);
            return res.status(500).json({
                error: 'An error occurred while securing password'
            });
        }
    });
};

const HospitalAdminLogin = (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required'
        })
    } else {
        // check if users actually exist in our database
        const query = 'SELECT * FROM hospital_admins WHERE email = ?'
        connection.query(query, [email], async (err, results) => {
            if (err) {
                console.log(`an error occured while trying to log you in`, err)
                return res.status(500).json({message:`An error occured while trying to log you in`})
            } else if (results.length === 0) {
                return res.status(404).json({message:`We couldn't find an account with that email`})
            }
            try {
                const user = results[0]
                const isMatch = await bcrypt.compare(password, user.password_hash)
                if (!match) {
                    console.log(`invalid password attempt for email: ${email}`)
                    return res.status(401).json({message:`Invalid password`})
                } else {
                    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' })
                    return res.status(200).json({
                        message: 'Login successful',
                        token,
                        email: user.email,
                        user_id: user.id
                    })
                }
            } catch (error) {
                console.log(`an error occured while trying to log you in`, error)
                return res.status(500).json({message:`An error occured while trying to log you in`})
            }
        })
    }
}

module.exports = { registerHospitalAdmin, HospitalAdminLogin };