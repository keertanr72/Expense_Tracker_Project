const express = require('express')

const checkUserController = require('../controllers/checkUser')
const premiumMembershipController = require('../controllers/premiumMembership')

const router = express()

router.get('/premium-membership', checkUserController.checkUser, premiumMembershipController.purchasePremium)

router.post('/payment-success', checkUserController.checkUser, premiumMembershipController.paymentSuccess)

module.exports = router