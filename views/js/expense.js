const expense = async (event) => {
    event.preventDefault()
    const amount = event.target.amount.value
    const description = event.target.description.value
    const category = event.target.category.value
    const addExpenseHere = document.getElementById('addExpenseHere')
    const token = localStorage.getItem('token')
    const obj = {
        amount,
        description,
        category
    }
    console.log(obj.amount)
    console.log(obj.description)

    if (!obj.amount) {
        alert('enter amount')
        return
    }

    try {
        currentExpense = await axios.post('http://localhost:3000/expense/create', obj, { headers: { "Authorization": token } })
        console.log(currentExpense)
        const newLine = document.createElement('li')
        newLine.innerHTML = ` ${amount} : ${description} : ${category} `
        const deletebtn = document.createElement('button')
        deletebtn.appendChild(document.createTextNode(' delete '))
        deletebtn.id = currentExpense.data.id
        deletebtn.style.backgroundColor = 'grey'
        newLine.appendChild(deletebtn)
        addExpenseHere.appendChild(newLine)
        document.getElementById(`${deletebtn.id}`).addEventListener('click', async (event) => {
            newLine.remove()
            await axios.delete(`http://localhost:3000/expense/delete/${deletebtn.id}`)
        })
    } catch (error) {
        console.log(error)
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token')
        const expenses = await axios.get('http://localhost:3000/expense/get-expense', { headers: { "Authorization": token } })
        console.log(expenses)
        const user = await axios.get('http://localhost:3000/user/get-info', { headers: { "Authorization": token } })
        if(user.data.isPremium){
            document.getElementById('premiumAccount').innerHTML = '<span class="premium-text">Premium Account</span>'
        }
        else{
            document.getElementById('premiumButton').innerHTML = 'Premium Membership'
        }
        const addExpenseHere = document.getElementById('addExpenseHere')
        expenses.data.forEach(expense => {
            const amount = expense.amount
            const description = expense.description
            const category = expense.category
            const newLine = document.createElement('li')
            newLine.innerHTML = ` ${amount} : ${description} : ${category} `
            const deletebtn = document.createElement('button')
            deletebtn.appendChild(document.createTextNode(' delete '))
            deletebtn.id = expense.id
            deletebtn.style.backgroundColor = 'grey'
            newLine.appendChild(deletebtn)
            addExpenseHere.appendChild(newLine)
            document.getElementById(`${expense.id}`).addEventListener('click', async (event) => {
                newLine.remove()
                await axios.delete(`http://localhost:3000/expense/delete/${expense.id}`)
            })
        });
    } catch (error) {
        console.log(error)
    }

})

document.getElementById('premiumButton').addEventListener('click', async (event) => {
    try {
        const token = localStorage.getItem('token')
        const membershipData = await axios.get('http://localhost:3000/purchase/premium-membership', { headers: { 'Authorization': token } })
        console.log(membershipData)
        const options = {
            'key': membershipData.data.key_id,
            'order_id': membershipData.data.order.id,
            'handler': async (membershipData) => {
                await axios.post('http://localhost:3000/purchase/payment-success', {
                    order_id: options.order_id,
                    payment_id: membershipData.razorpay_payment_id
                }, {headers: {'Authorization': token}})
                alert('You are a Premium Member!')
                window.location.reload()
            }
        }
        const rzp1 = new Razorpay(options)
        rzp1.open()
        event.preventDefault()
        rzp1.on('payment.failed', () => {
            console.log('payment failed')
        })
    } catch (error) {
        console.log(error)
    }
})