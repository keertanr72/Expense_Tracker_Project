const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const userRoutes = require('./routes/user')

const app = express()
app.use(cors())

app.use(bodyParser.json({extended: false}))

app.use('/user', userRoutes)

app.listen(3000)