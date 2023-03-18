const Razorpay = require('razorpay')
const Sequelize = require('sequelize')
require('dotenv').config()
const User = require('../models/user')
const Order = require('../models/order')
const Expense = require('../models/expense')
exports.purchasePremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.key_id ,
            key_secret: process.env.key_secret
        })
        const amount = 1000
        rzp.orders.create({amount: amount, currency: 'INR'}, async (err, order) => {
            if(err){
                return res.status(500).json({message: 'rzp order unsuccessfull'})
            }
            await Order.create({orderId: order.id, userId: req.user.userId, status: 'pending'})
            return res.status(200).json({order, key_id: rzp.key_id})
        })
    } catch (error) {
        console.log(error)
    }
}

exports.paymentSuccess = async (req, res) => {
    try {
        console.log('paymentSuccess', req.user.userId)
        const userData = User.findByPk(req.user.userId)
        const orderData = Order.findOne({where: {orderId: req.body.order_id}})
        const result = await Promise.all([userData, orderData])
        const orderUpdate = result[1].update({paymentId: req.body.payment_id, status: 'success'})
        const userUpdate = result[0].update({isPremium: true})
        await Promise.all([userUpdate, orderUpdate])
        res.status(200).json({message: 'payment successfull'})
    } catch (error) {
        console.log(error)
    }
}

exports.getUsersLeaderboard = async (req, res) => {
    try {
        const usersLeaderboard = await User.findAll({
            attributes: ['totalExpenseAmount', 'userName', 'id'],
              order: [['totalExpenseAmount','DESC']]
        })
        res.json(usersLeaderboard)
    } catch (error) {
        console.log(error)
    }
}