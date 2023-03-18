const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Expense = require('../models/expense')

const User = require('../models/user')

exports.postCheckEmail = async (req, res) => {
        const user = await User.findOne({ where: { email: req.body.email } })
        if(user)
        res.status(500).json(user)
        else
        res.status(200).json(user)
}

exports.getInfo = async (req, res) => {
    try {
        const userData = await User.findByPk(req.user.userId)
        console.log('uuuuuuuuuuuuuuuserddddddddddata', userData.isPremium)
        res.json(userData)
    } catch (error) {
        console.log(error)
    }
}

exports.getUsersLeaderboard = async (req, res) => {
    try {
        // const usersLeaderboard = await User.findAll({
        //     attributes: [
        //                 'id',
        //                 'userName',
        //                 [Sequelize.fn('SUM', Sequelize.col('expenses.amount')), 'totalAmountSpent']
        //               ],
        //     include:
        // })
        const usersLeaderboard = await User.findAll({
            attributes: [
                'id',
                'userName',
                [Sequelize.fn('SUM', Sequelize.col('expenses.amount')), 'totalAmountSpent']
              ],
              include: [{
                model: Expense,
                attributes: []
              }],
              group: ['user.id'],
              order: [['totalAmountSpent','DESC']]
        })
        res.json(usersLeaderboard)
    } catch (error) {
        console.log(error)
    }
}

exports.postCreateUser = async (req, res) => {
    try{
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            await User.create({
                userName: req.body.userName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: hash,
                isPremium: false
            })
            res.status(200).json({message: 'User created successfully'})
        })
    }
    catch(err){
        console.log(err)
    }
}

const generateToken = (id) => {
    return jwt.sign({userId: id}, 'secretKey')
}

exports.postLogin = async (req, res) => {
    try {
        const userData = await User.findAll({where: {email: req.body.email}})
        bcrypt.compare(req.body.password, userData[0].password, async (err, result) => {
            if(err){
                res.status(500).json({message: 'Something Went wrong'})
            }
            if(result){
                res.status(200).json({message: 'login successfull', token: generateToken(userData[0].id)})
            }
            else{
                res.status(401).json({message: 'wrong password'})
            }
        })
    } catch (error) {
        res.status(404).json({message: 'user not present'})
        console.log(error)
    }
}