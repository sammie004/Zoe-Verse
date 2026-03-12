// dependency imports
const connection = require('../connection/connection');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
dotenv.config();

// main code
const Login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log(`those fields can not be empty!`)
        return res.status(400).json({message: `Email and password are Required!`})
    }
    // check if user actually exists
    const check = `select * from users where email = ?`
    connection.query(check, [email], async (err, results) => {
        if (err) {
            console.log(`❌ Error checking existing email: ${err}`);
            return res.status(500).json({ error: 'An error occurred while checking email' });
        } else {
            if (results.length === 0) {
                console.log(`an error occured while logging in: user with email ${email} does not exist!`)
                return res.status(404).json({ error: 'User not found' });
            }
        }
        const user = results[0]
        const ismatch = await bcrypt.compare(password, user.password_hash)
        if (!ismatch) {
            console.log(`the password provided is incorrect!`)
            return res.status(401).json({ error: 'Invalid credentials' });
        } else {
            const token = jwt.sign({id:user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'})
            return res.status(200).json({ message:`Login successful!`, token , email: user.email, id: user.id});
        }
    })
}
module.exports = { Login }