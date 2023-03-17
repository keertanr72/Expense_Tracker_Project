const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const sequelize = require('./util/database')

const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')

const errorController = require('./controllers/error')

const Expense = require('./models/expense')
const User = require('./models/user')
const Order = require('./models/order')

const app = express()
app.use(cors())

app.use(bodyParser.json({extended: false}))

app.use('/user', userRoutes)

app.use('/expense', expenseRoutes)

app.use('/purchase', purchaseRoutes)

app.use(errorController.getError)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

sequelize
.sync()
// .sync({force: true})
.then(() => {
    app.listen(3000)
})
.catch(err => console.log(err))