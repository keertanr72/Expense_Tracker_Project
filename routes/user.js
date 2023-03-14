const express = require('express')

const userController = require('../controllers/user')

const router = express()

router.get('/sign-up', userController.getSignUp)

router.post('/sign-up', userController.postSignUp)

router.get('/login', userController.getLogin)

router.post('/login', userController.postLogin)

module.exports = router