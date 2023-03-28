const express = require('express')

const expenseController = require('../controllers/expense')
const checkUserController = require('../controllers/checkUser')

const router = express()

router.get('/get-expense/:buttonNumber', checkUserController.checkUser, expenseController.getExpense)

router.get('/get-number-of-expenses', checkUserController.checkUser, expenseController.getNumberOfExpenses)

router.post('/create', checkUserController.checkUser, expenseController.postCreateExpense)

router.delete('/delete/:id', checkUserController.checkUser, expenseController.postDeleteExpense)

module.exports = router