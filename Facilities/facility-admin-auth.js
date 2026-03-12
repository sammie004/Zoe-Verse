// facility manages, dashboard
const connection = require("../connection/connection")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const FacilityOnboarding = (req, res) => {
    const { first_name, last_name, username, email, password, role } = req.body
    
    // check if the admin, already exists
    const check_query = `select * from facility_admins where email = ?`
    connection.query(check_query, [email], (err, results) => { 
        if (err) {
            console.log(`❌ an error occured while checking for existing admin: ${err}`)
            
            return res.status(500).json({ error: "An error occurred while checking for existing admin," , error: err })
        } if (results.length > 0) {
            console.log(`❌ an admin with the email ${email} already exists`)
            return res.status(400).json({ error: "An admin with this email already exists" })
        } else {
            // password hashing
            const salt_rounds = 10
            bcrypt.hash(password, salt_rounds, (err, hashedPassword) => {
                if (err) {
                    console.log(`❌ an error occured while hashing the password: ${err}`)
                    return res.status(500).json({ error: "An error occurred while hashing the password" })
                } else {
                    console.log(hashedPassword)
                    const insert = `insert into facility_admins (first_name, last_name, username, email, password, role) values (?, ?, ?, ?, ?, ?)`
                    connection.query(insert, [first_name, last_name, username, email, hashedPassword, role], (err, results) => {
                        if (err) {
                            console.log(`❌ an error occured while inserting the admin: ${err}`)
                            return res.status(500).json({ error: "An error occurred while inserting the admin" })
                        } else {
                            console.log(`✅ admin created successfully`)
                            return res.status(201).json({ message: "Account created successfully" })
                        }
                    })
                }
            })
        }
    })
}

const FacilityLogin = (req, res) => {
    const { email, password } = req.body
    const check = `select * from facility_admins where email = ?`
    connection.query(check, [email], (err, results) => { 
        if (err) {
            console.log(`an error occured`, err)
            return res.status(500).json({message:`An error occured please try again later`})
        } else if (results.length === 0) {
            console.log(`This user does not exist`)
        }
        const admin = results[0]
        const Match = bcrypt.compare(password, admin.password, (err, isMatch) => { 
            if (err) {
                console.log(`an error occured`, err)
                return res.status(500).json({message:`An error occured please try again later`})
            }
            if(!isMatch) {
                console.log(`Incorrect password`)
                return res.status(400).json({message:`Incorrect password`})
            } else {
                const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
                console.log(`Login successful`)
                return res.status(200).json({ message: "Login successful", token })
            }
        })
    })
}
module.exports = {
    FacilityOnboarding,
    FacilityLogin
}