const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

require('./app/controllers/authController')(app)
require('./app/controllers/clientController')(app)

app.listen(3001)