const mysql = require("mysql")
const dotenvv = require("dotenv")
dotenvv.config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

connection.connect((err) => { 
    if (err) {
        console.log(`❌ an error occured while connecting to the database: ${err}`)
    } else {
        console.log("✅Connected to the database")
    }
})
module.exports = connection