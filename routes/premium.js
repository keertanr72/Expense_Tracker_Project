const express = require('express')

const checkUserController = require('../controllers/checkUser')
const premiumMembershipController = require('../controllers/premiumMembership')

const router = express()

router.get('/get-users-leaderboard', checkUserController.checkUser, premiumMembershipController.getUsersLeaderboard)

router.get('/purchase', checkUserController.checkUser, premiumMembershipController.purchasePremium)

router.post('/payment-success', checkUserController.checkUser, premiumMembershipController.paymentSuccess)

module.exports = router