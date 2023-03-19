const express = require('express')

const forgotPasswordController = require('../controllers/forgotPassword')

const router = express()

router.post('/update-password', forgotPasswordController.updatePassword)

router.post('/forgot-password', forgotPasswordController.postForgotPassword)

router.get('/forgot-password/:id', forgotPasswordController.getOnLinkClick)

module.exports = router