const Sequelize = require('sequelize')

const User = require('../models/user')

exports.getUserDetails = async (req, res) => {
    const data = await User.findAll()
    try{
        res.json(data)
    }
    catch(err){
        console.log(err)
    }
}

exports.postUserDetails = async (req, res) => {
    const data = await User.create({
        userName: req.body.userName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
    })
    try{
        res.json(data)
    }
    catch(err){
        console.log(err)
    }
}