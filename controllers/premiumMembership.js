const Razorpay = require('razorpay')
require('dotenv').config()
const User = require('../models/user')
const Order = require('../models/order')
exports.purchasePremium = async (req, res) => {
    try {
        // console.log(process.env.key_id, process.env.key_secret, req.user, '#############################################')
        const rzp = new Razorpay({
            key_id: process.env.key_id ,
            key_secret: process.env.key_secret
        })
        const amount = 1000
        rzp.orders.create({amount: amount, currency: 'INR'}, async (err, order) => {
            if(err){
                console.log(err,'.........................')
                return res.status(500).json({message: 'rzp order unsuccessfull'})
            }
            // console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', order)
            // await req.user.createOrder({orderId: order.id, status: 'pending'})
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
        const userData = await User.findByPk(req.user.userId)
        const orderData = await Order.findOne({where: {orderId: req.body.order_id}})
        await userData.update({isPremium: true})
        await orderData.update({paymentId: req.body.payment_id, status: 'success'})
        res.status(200).json({message: 'payment successfull'})
    } catch (error) {
        console.log(error)
    }
}