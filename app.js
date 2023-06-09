const express = require('express')
const path = require('path')
const fs = require('fs')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const sequelize = require('./util/database')

const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense')
const premiumRoutes = require('./routes/premium')
const forgotPasswordRoutes = require('./routes/forgotPassword')

const errorController = require('./controllers/error')

const Expense = require('./models/expense')
const User = require('./models/user')
const Order = require('./models/order')
const ForgotPasswordRequest = require('./models/forgotPasswordRequests')
const ExpenseDownload = require('./models/expenseDownload')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

const app = express()

app.use(helmet())

app.use(compression())

app.use(morgan('combined', {stream: accessLogStream}))

app.use(cors())

app.use(bodyParser.json({extended: false}))

app.use('/user', userRoutes)

app.use('/expense', expenseRoutes)

app.use('/premium', premiumRoutes)

app.use('/password', forgotPasswordRoutes)

// app.get('/:fileType/:something', function(req, res) {
//     const something = req.params.something
//     const fileType = req.params.fileType
//     res.sendFile(__dirname + `/public/views/${fileType}/${something}`, { protocol: 'http' });
//   });

app.use((req, res) => {
    console.log(__dirname, `public/views/${req.url}`)
    res.sendFile(path.join(__dirname, `public/views/${req.url}`))
})

app.use(errorController.getError)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgotPasswordRequest)
ForgotPasswordRequest.belongsTo(User)

User.hasMany(ExpenseDownload)
ExpenseDownload.belongsTo(User)

sequelize
.sync()
// .sync({force: true})
.then(() => {
    app.listen(3000)
})
.catch(err => console.log(err))