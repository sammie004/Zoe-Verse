const connection = require('../connection/connection')

const getAllUsers = (req, res) => { 
    const query = 'SELECT id, role_id, first_name, last_name, email, date_of_birth, profile_image_url, gender, is_verified, status FROM users'
    connection.query(query, (err, results) => {
        if (err) {
            console.log(`❌ Error fetching users: ${err}`);
            return res.status(500).json({ error: 'An error occurred while fetching users' });
        }
        return res.status(200).json({ users: results });
    })
}

const SearchUsers = (req, res) => {
    const { search } = req.query;

    let sql = `
        SELECT id, first_name, last_name, email, status, created_at
        FROM users
        WHERE 1=1
    `;

    let params = [];

    if (search) {
        sql += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
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

const FilterUsers = (req, res) => {
    const { status } = req.query;
    let sql = `selcect id, first_name, last_name, email, status, created_at from users where 1=1`;
    let params = [];

    if (status) {
        sql += ` AND status = ?`;
        params.push(status);
    }

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

module.exports = {
    getAllUsers, SearchUsers, FilterUsers
}