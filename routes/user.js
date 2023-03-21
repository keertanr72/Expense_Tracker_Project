const express = require('express')

const userController = require('../controllers/user')
const checkUserController = require('../controllers/checkUser')

const router = express()

router.get('/download', checkUserController.checkUser, userController.getDownloadExpense)

router.get('/old-downloads', checkUserController.checkUser, userController.getOldDownloads)

router.get('/get-info', checkUserController.checkUser, userController.getInfo)

router.post('/sign-up/check-email', userController.postCheckEmail)

router.post('/sign-up', userController.postCreateUser)

router.post('/login', userController.postLogin)

module.exports = router