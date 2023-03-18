const Expense = require('../models/expense')
const User = require('../models/user')
const sequelize = require('../util/database')

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
    const transaction = await sequelize.transaction()
    try {
        const newExpense = Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.userId
        }, {transaction})
        let totalExpenseAmount = User.findByPk(req.user.userId, {
            attributes: ['totalExpenseAmount']
        })
        let data = await Promise.all([newExpense,totalExpenseAmount])
        data[1].totalExpenseAmount += parseInt(amount)
        await User.update({totalExpenseAmount: data[1].totalExpenseAmount}, {where: {id: req.user.userId}, transaction})
        await transaction.commit();
        res.status(200).json(newExpense)
    } catch (error) {
        console.log(error)
        await transaction.rollback()
    }   
}

exports.postDeleteExpense = async (req, res) => {
    try {
        const deleteId = req.params.id
        const amount = req.query.amount
        console.log('amount: ', amount)
        let totalExpenseAmount = await User.findByPk(req.user.userId, {
            attributes: ['totalExpenseAmount']
        })
        console.log(totalExpenseAmount.totalExpenseAmount)
        totalExpenseAmount.totalExpenseAmount -= parseInt(amount)
        console.log(totalExpenseAmount.totalExpenseAmount)
        const p1 =  User.update({totalExpenseAmount: totalExpenseAmount.totalExpenseAmount}, {where: {id: req.user.userId}})
        const p2 = Expense.destroy({where: {id: deleteId}})
        await Promise.all([p1, p2])
    } catch (error) {
        console.log(error)
    }
}