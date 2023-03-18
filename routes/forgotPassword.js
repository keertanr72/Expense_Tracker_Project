const express = require('express')

const forgotPasswordController = require('../controllers/forgotPassword')

const router = express()

router.post('/forgot-password', forgotPasswordController.postForgotPassword)

module.exports = router