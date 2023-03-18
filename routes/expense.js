const express = require('express')

const expenseController = require('../controllers/expense')
const checkUserController = require('../controllers/checkUser')

const router = express()

router.get('/get-expense', checkUserController.checkUser, expenseController.getExpense)

router.post('/create', checkUserController.checkUser, expenseController.postCreateExpense)

router.delete('/delete/:id', checkUserController.checkUser, expenseController.postDeleteExpense)

module.exports = router