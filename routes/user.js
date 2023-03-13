const express = require('express')

const userController = require('../controllers/user')

const router = express()

router.get('/details', userController.getUserDetails)

router.post('/details', userController.postUserDetails)

module.exports = router