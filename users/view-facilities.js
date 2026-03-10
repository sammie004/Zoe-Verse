const connection = require("../connection/connection")

// fetch all faclilties
const fetch_facilities = (req, res) => {
    const fetch_query = `select id, name, location, contact_info, description, profile_image_url from facilities`
    connection.query(fetch_query, (err, results) => {
        if (err) {
            console.log(`❌ Error fetching facilities: ${err}`);
            return res.status(500).json({
                error: 'An error occurred while fetching facilities'
            });
        }
        return res.status(200).json({
            message: 'Facilities fetched successfully',
            facilities: results
        });
    });
}

module.exports = { fetch_facilities }