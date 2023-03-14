const Sequelize = require('sequelize')

const User = require('../models/user')

exports.getSignUp = async (req, res) => {
    try{
        const data = await User.findAll()
        res.status(200).json(data)
    }
    catch(err){
        console.log(err)
    }
}

exports.postSignUp = async (req, res) => {
    
    try{
        const data = await User.create({
            userName: req.body.userName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password
        })
        res.status(200).json(data)
    }
    catch(err){
        console.log(err)
    }
}

exports.getLogin = async (req, res) => {
    
}

exports.postLogin = async (req, res) => {
    try {
        const userData = await User.findAll({where: {email: req.body.email}})
        if(userData[0].password === req.body.password){
            res.status(200).json({userData})
        }
        else{
            res.status(401).json({message: 'wrong password'})
        }
    } catch (error) {
        res.status(404).json({message: 'user not present'})
        console.log(error)
    }
}