const expense = async (event) => {
    // alert(event.target.category.value)
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

    if(!obj.amount){
        alert('enter amount')
        return
    }
     
    try {
        currentExpense = await axios.post('http://localhost:3000/expense/create', obj, {headers: {"Authorization": token}})
        console.log(currentExpense)
        const newLine = document.createElement('p')
        newLine.innerHTML = ` ${amount} : ${description} : ${category} `
        const deletebtn = document.createElement('button')
        deletebtn.appendChild(document.createTextNode(' delete '))
        deletebtn.id = currentExpense.data.id
        deletebtn.style.backgroundColor = 'grey'
        newLine.appendChild(deletebtn)
        addExpenseHere.appendChild(newLine)
        document.getElementById(`${deletebtn.id}`).addEventListener('click', async(event) => {
            newLine.remove()
            await axios.delete(`http://localhost:3000/expense/delete/${deletebtn.id}`)
        })
    } catch (error) {
        console.log(error)
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')
    const expenses = await axios.get('http://localhost:3000/expense/get-expense', {headers: {"Authorization": token}})
    const addExpenseHere = document.getElementById('addExpenseHere')
    expenses.data.forEach(expense => {
        const amount = expense.amount
        const description = expense.description
        const category = expense.category
        const newLine = document.createElement('p')
        newLine.innerHTML = ` ${amount} : ${description} : ${category} `
        const deletebtn = document.createElement('button')
        deletebtn.appendChild(document.createTextNode(' delete '))
        deletebtn.id = expense.id
        deletebtn.style.backgroundColor = 'grey'
        newLine.appendChild(deletebtn)
        addExpenseHere.appendChild(newLine)
        document.getElementById(`${expense.id}`).addEventListener('click', async(event) => {
            newLine.remove()
            await axios.delete(`http://localhost:3000/expense/delete/${expense.id}`)
        })
    });
})