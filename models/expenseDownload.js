const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const ExpenseDownload = sequelize.define('expensedownload', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    url: Sequelize.STRING
})

module.exports = ExpenseDownload