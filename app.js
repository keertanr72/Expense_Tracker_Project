const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const userRoutes = require('./routes/user')

const errorController = require('./controllers/error')

const app = express()
app.use(cors())

app.use(bodyParser.json({extended: false}))

app.use('/user', userRoutes)

app.use(errorController.getError)

app.listen(3000)