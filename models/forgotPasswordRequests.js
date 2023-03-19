const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const ForgotPasswordRequest = sequelize.define('forgotPasswordRequest', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    isActive: Sequelize.BOOLEAN
})

module.exports = ForgotPasswordRequest