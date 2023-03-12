const express = require('express')

const router = express()

router.get('/details', (req, res) => {
    res.json({hello: 'hello'})
})

router.post('/details', (req, res) => {
    res.json({hello: 'hello'})
})

module.exports = router