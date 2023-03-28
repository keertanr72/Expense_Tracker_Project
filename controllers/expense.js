const Expense = require('../models/expense')
const User = require('../models/user')
const sequelize = require('../util/database')

exports.getExpense = async (req, res) => {
    try {
        const rowsPerPage = req.query.rowsPerPage
        const buttonNumber = req.params.buttonNumber
        if(!rowsPerPage){
            const expenses = await Expense.findAll({
                where: {userId: req.user.userId},
                offset: (buttonNumber - 1) * 10,
                limit: 10
            })
            res.status(200).json(expenses)
        }
        const expenses = await Expense.findAll({
            where: {userId: req.user.userId},
            offset: (buttonNumber - 1) * parseInt(rowsPerPage),
            limit: parseInt(rowsPerPage)
        })
        res.status(200).json(expenses)
    } catch (error) {
        console.log(error)
    }
}

exports.getNumberOfExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAndCountAll({where: {userId: req.user.userId}})
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
        let totalExpenseAmount = await User.findByPk(req.user.userId, {
            attributes: ['totalExpenseAmount']
        })
        totalExpenseAmount.totalExpenseAmount -= parseInt(amount)
        const p1 =  User.update({totalExpenseAmount: totalExpenseAmount.totalExpenseAmount}, {where: {id: req.user.userId}})
        const p2 = Expense.destroy({where: {id: deleteId}})
        const response = await Promise.all([p1, p2])
        res.json({response})
    } catch (error) {
        console.log(error)
    }
}