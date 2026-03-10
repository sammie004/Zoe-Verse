const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(bodyParser.json())
// require in app dependencies
const connection = require("./connection/connection")
const authRoutes = require('./routes/user-auth-route/auth')
const admin_filter = require('./routes/Admin-routes/search')

// mounting the routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', admin_filter)
// listening to the server
const port = 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})