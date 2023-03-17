const Sequelize = require('sequelize')

const sequelize = new Sequelize('expense_tracker_database', 'root', 'Keertan@12345', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize