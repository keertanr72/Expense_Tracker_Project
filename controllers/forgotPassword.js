const Sib = require('sib-api-v3-sdk')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()
const bcrypt = require('bcrypt')

const ForgotPasswordRequest = require('../models/forgotPasswordRequests')
const User = require('../models/user')

exports.postForgotPassword = async (req, res) => {
    const userEmail = req.body.email
    const client = Sib.ApiClient.instance
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.API_KEY
    const tranEmailApi = new Sib.TransactionalEmailsApi()
    const idOfForgotPassword = uuidv4()
    try {
        const sender = {
            email: 'keertanr72@gmail.com'
        }
        const receivers = [
            {
                email: `${userEmail}`,
            },
        ]
        const p1 = tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'From Expense Tracker',
            textContent:
                `Click this for new password: http://localhost:3000/password/forgot-password/${idOfForgotPassword}`
        })
        const userData = User.findOne({ where: { email: userEmail } })
        const returnedPromise = await Promise.all([p1, userData])
        if (!returnedPromise[1])
            res.status(403).json({ message: 'user doesnt exist' })
        await ForgotPasswordRequest.create({
            id: idOfForgotPassword,
            isActive: true,
            userId: returnedPromise[1].id
        })
        res.status(200).json({ message: 'successfull' })
    } catch (error) {
        console.log(error)
    }

}

exports.getOnLinkClick = async (req, res) => {
    try {
        const forgotPasswordId = req.params.id
        const data = await ForgotPasswordRequest.findByPk(forgotPasswordId, {
            include: {
                model: User,
                attributes: ['password']
            }
        })
        await data.update({ isActive: false })
        res.redirect('http://127.0.0.1:5501/public/newPassword.html')
    } catch (error) {
        console.log(error)
    }

}

exports.updatePassword = async (req, res) => {
    const {email, password} = req.body
    const data = await User.findOne({where: {email}})
    try {
        bcrypt.hash(password, 10, async (err, hash) => {
            if(err)
            console.log(err)
            await data.update({password: hash})
            res.status(200).json({message: 'User password Updated successfully'})
        })
    } catch (error) {
        console.log(error)
    }
    
}