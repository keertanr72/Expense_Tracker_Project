const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')

const User = require('../models/user')
const Expense = require('../models/expense')
const ExpenseDownload = require('../models/expenseDownload')

const uploadToS3 = async (stringifiedExpenses, fileName) => {
    const BUCKET_NAME = process.env.BUCKET_NAME
    const IAM_USER_KEY = process.env.IAM_USER_KEY
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET

    const s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })

    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: stringifiedExpenses,
        ACL: 'public-read'
    }

    try {
        return new Promise((resolve, reject) => {
            s3Bucket.upload(params, (err, s3Response) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(s3Response.Location)
                }
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'something went wrong'})
    }
}

exports.postCheckEmail = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (user)
        res.status(500).json(user)
    else
        res.status(200).json(user)
}

exports.getInfo = async (req, res) => {
    try {
        const userData = await User.findByPk(req.user.userId)
        res.json(userData)
    } catch (error) {
        console.log(error)
    }
}

exports.postCreateUser = async (req, res) => {
    try {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            await User.create({
                userName: req.body.userName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: hash,
                isPremium: false,
                totalExpenseAmount: 0
            })
            res.status(200).json({ message: 'User created successfully' })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message: 'something went wrong'})
    }
}

const generateToken = (id) => {
    return jwt.sign({ userId: id }, 'secretKey')
}

exports.postLogin = async (req, res) => {
    try {
        const userData = await User.findAll({ where: { email: req.body.email } })
        bcrypt.compare(req.body.password, userData[0].password, async (err, result) => {
            if (err) {
                res.status(500).json({ message: 'Something Went wrong' })
            }
            if (result) {
                res.status(200).json({ message: 'login successfull', token: generateToken(userData[0].id) })
            }
            else {
                res.status(401).json({ message: 'wrong password' })
            }
        })
    } catch (error) {
        res.status(404).json({ message: 'user not present' })
        console.log(error)
    }
}

exports.getDownloadExpense = async (req, res) => {
    const expenses = await Expense.findAll({ where: { userId: req.user.userId } })
    const stringifiedExpenses = JSON.stringify(expenses)
    console.log(stringifiedExpenses)
    const newUserId = req.user.userId
    const fileName = `Expense/${newUserId}/${new Date()}.txt`
    try {
        const fileUrl = await uploadToS3(stringifiedExpenses, fileName)
        console.log(fileUrl)
        await ExpenseDownload.create({
            url: fileUrl,
            userId: req.user.userId
        })
        res.status(200).json({ fileUrl })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'something went wrong'})
    }
}

exports.getOldDownloads = async (req, res) => {
    const urls = await ExpenseDownload.findAll({attributes: ['url'], where: {userId: req.user.userId}})
    res.status(200).json(urls)
}