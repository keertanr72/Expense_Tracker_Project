const express = require('express')

const expenseController = require('../controllers/expense')

const router = express()

router.get('/get-expense', expenseController.getExpense)

router.post('/create', expenseController.postCreateExpense)

router.delete('/delete/:id', expenseController.postDeleteExpense)

module.exports = router