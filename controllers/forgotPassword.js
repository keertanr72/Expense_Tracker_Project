const Sib = require('sib-api-v3-sdk')

require('dotenv').config()

exports.postForgotPassword = async (req, res) => {
    try {
        const userEmail = req.body.email
        const client = Sib.ApiClient.instance
        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.API_KEY
        const tranEmailApi = new Sib.TransactionalEmailsApi()
        const sender = {
            email: 'keertanr72@gmail.com'
        }
        const receivers = [
            {
                email: `${userEmail}`,
            },
        ]
        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'From Expense Tracker',
            textContent:
            `HELLO AMMA ${userEmail}`
        })      
    } catch (error) {
        console.log(error)
    }
    
}