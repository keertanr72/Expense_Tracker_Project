const Expense = require('../models/expense')
const User = require('../models/user')

exports.getExpense = async (req, res) => {
    try {
        console.log(req.user, 'getExpense')
        const expenses = await Expense.findAll({where: {userId: req.user.userId}})
        res.status(200).json(expenses)
    } catch (error) {
        console.log(error)
    }
}

exports.postCreateExpense = async (req, res) => {
    const {amount, description, category} = req.body
    try {
        console.log(req.user, 'createexpense')
        const newExpense = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.userId
        })
        res.status(200).json(newExpense)
    } catch (error) {
        console.log(error)
    }   
}

exports.postDeleteExpense = async (req, res) => {
    try {
        const deleteId = req.params.id
        await Expense.destroy({where: {id: deleteId}})
    } catch (error) {
        console.log(error)
    }
}