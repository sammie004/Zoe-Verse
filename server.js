const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const dotenv = require("dotenv")
app.use(cors())
app.use(bodyParser.json())
dotenv.config()
// require in app dependencies
const connection = require("./connection/connection")
const authRoutes = require('./routes/user-routes/auth')
const admin_filter = require('./routes/Admin-routes/search')
const facility_auth = require('./routes/Facilities/Facility-auth')
const facility_creation = require('./routes/Facilities/Facilities-creation')

// mounting the routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', admin_filter)
app.use('/api/auth/facility', facility_auth)
app.use('/api/facilities', facility_creation)

// listening to the server
const port = 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})