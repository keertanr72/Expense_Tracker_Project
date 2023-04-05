let numberOfExpenses = 0
let globalExpenses
console.log(document.getElementById('rowsPerPage').value)
const expense = async (event) => {
    event.preventDefault()
    const amount = event.target.amount.value
    const description = event.target.description.value
    const category = event.target.category.value
    const token = localStorage.getItem('token')
    const obj = {
        amount,
        description,
        category
    }

    if (!obj.amount) {
        alert('enter amount')
        return
    }

    try {
        currentExpense = await axios.post('http://3.84.222.111:3000/expense/create', obj, { headers: { "Authorization": token } })
        window.location.reload()
    } catch (error) {
        console.log(error)
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const buttonNumber = await pagination()
    expensePageData(true, buttonNumber)
})

const pagination = async () => {
    const token = localStorage.getItem('token')
    const expenses = await axios.get('http://3.84.222.111:3000/expense/get-number-of-expenses', { headers: { "Authorization": token } })
    numberOfExpenses = expenses.data.count
    globalExpenses = expenses
   
    document.getElementById('pagination').innerHTML = 
    `<ul>
        <li><button id='prevButton' >Prev</button></li>
        <li><button id='firstButton' >1</button></li>
        <li><button id='secondButton'>2</button></li>
        <li><button id='thirdButton'>3</button></li>
        <li><button id='nextButton' >Next</button></li>
    </ul>`

    document.getElementById('firstButton').addEventListener('click', firstButtonFunction)

    document.getElementById('secondButton').addEventListener('click', secondButtonFunction)

    document.getElementById('thirdButton').addEventListener('click', thirdButtonFunction)

    document.getElementById('nextButton').addEventListener('click', nextFunction)

    document.getElementById('prevButton').addEventListener('click', prevFunction)
  
    return 1
}

const firstButtonFunction = async () => {
    const buttonNumber = document.getElementById('pagination').getElementsByTagName('button')[1].innerHTML 
    alert(`${buttonNumber}`)
    await expensePageData(false, buttonNumber)
}

const secondButtonFunction = async () => {
    const buttonNumber = document.getElementById('pagination').getElementsByTagName('button')[2].innerHTML 
    alert(`${buttonNumber}`)
    await expensePageData(false, buttonNumber)
}

const thirdButtonFunction = async () => {
    const buttonNumber = document.getElementById('pagination').getElementsByTagName('button')[3].innerHTML 
    alert(`${buttonNumber}`)
    await expensePageData(false, buttonNumber)
}

const nextFunction = () => {
    if(numberOfExpenses/10 <= document.getElementById('pagination').getElementsByTagName('button')[3].innerHTML){
        return
    }
    document.getElementById('pagination').getElementsByTagName('button')[1].innerHTML = parseInt(document.getElementById('pagination').getElementsByTagName('button')[1].innerHTML) + 1
    document.getElementById('pagination').getElementsByTagName('button')[2].innerHTML = parseInt(document.getElementById('pagination').getElementsByTagName('button')[2].innerHTML) + 1
    document.getElementById('pagination').getElementsByTagName('button')[3].innerHTML = parseInt(document.getElementById('pagination').getElementsByTagName('button')[3].innerHTML) + 1
}

const prevFunction = () => {
    if(document.getElementById('pagination').getElementsByTagName('button')[1].innerHTML == 1){
        return
    }
    document.getElementById('pagination').getElementsByTagName('button')[1].innerHTML = parseInt(document.getElementById('pagination').getElementsByTagName('button')[1].innerHTML) - 1
    document.getElementById('pagination').getElementsByTagName('button')[2].innerHTML = parseInt(document.getElementById('pagination').getElementsByTagName('button')[2].innerHTML) - 1
    document.getElementById('pagination').getElementsByTagName('button')[3].innerHTML = parseInt(document.getElementById('pagination').getElementsByTagName('button')[3].innerHTML) - 1
    console.log('hello')
}

const expensePageData = async (leaderboardButtonNeeded, buttonNumber) => {
    try {
        console.log('button number', buttonNumber)
        console.log(globalExpenses.data.count)
        console.log(globalExpenses.data.rows)
        document.getElementById('addExpenseHere').innerHTML = ''
        const token = localStorage.getItem('token')
        const rowsPerPage = localStorage.getItem('rowsPerPage')
        const expenses = await axios.get(`http://3.84.222.111:3000/expense/get-expense/${buttonNumber}?rowsPerPage=${rowsPerPage}`, { headers: { "Authorization": token } })
        console.log('eeeeeeeeeeeeeexpenses', expenses.data)
        const user = await axios.get('http://3.84.222.111:3000/user/get-info', { headers: { "Authorization": token } })
        if (user.data.isPremium && leaderboardButtonNeeded) {
            document.getElementById('premiumAccount').innerHTML = '<span class="premium-text">Premium Account</span>'
            document.getElementById('OldDownloads').innerHTML = '<button type="button" onclick="OldDownloads()">Old Downloads</button>'
            const leaderboardButton = document.createElement("button");
            const downloadButton = document.createElement("button");
            leaderboardButton.innerHTML = "Leaderboard";
            downloadButton.innerHTML = "Download Expenses";
            leaderboardButton.type = 'button'
            downloadButton.type = 'button'
            leaderboardButton.onclick = displayLeaderboard
            downloadButton.onclick = downloadExpense
            leaderboardButton.setAttribute("id", "leaderboardButton");
            downloadButton.setAttribute("id", "downloadButton");
            document.getElementById('expenseFormId').appendChild(leaderboardButton);
            document.getElementById('expenseFormId').appendChild(downloadButton);
        }
        else {
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
                await axios.delete(`http://3.84.222.111:3000/expense/delete/${expense.id}/?amount=${amount}`, { headers: { "Authorization": token } })
            })
        });
        console.log(numberOfExpenses)
        
    } catch (error) {
        console.log(error)
    }
}

document.getElementById('premiumButton').addEventListener('click', async (event) => {
    try {
        const token = localStorage.getItem('token')
        const membershipData = await axios.get('http://3.84.222.111:3000/premium/purchase', { headers: { 'Authorization': token } })
        console.log(membershipData)
        const options = {
            'key': membershipData.data.key_id,
            'order_id': membershipData.data.order.id,
            'handler': async (membershipData) => {
                await axios.post('http://3.84.222.111:3000/premium/payment-success', {
                    order_id: options.order_id,
                    payment_id: membershipData.razorpay_payment_id
                }, { headers: { 'Authorization': token } })
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

const displayLeaderboard = async () => {
    expensePageData(false)
    document.querySelector('body').innerHTML +=
        `<div id="leaderboard">
    </div>
    <div id="leaderboard-text">
        
    </div>`
    try {
        const token = localStorage.getItem('token')
        const users = await axios.get('http://3.84.222.111:3000/premium/get-users-leaderboard', { headers: { 'Authorization': token } })
        console.log(users.data)
        document.getElementById('leaderboard').innerHTML = 'LeaderBoard'
        document.getElementById('leaderboard-text').innerHTML = ''
        users.data.forEach((user) => {
            if (user.totalExpenseAmount) {
                document.getElementById('leaderboard-text').innerHTML +=
                    `<li>${user.userName} : ${user.totalExpenseAmount}</li>`
            }
            else {
                document.getElementById('leaderboard-text').innerHTML +=
                    `<li>${user.userName} : 0</li>`
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const downloadExpense = async () => {
    alert('hii')
    const token = localStorage.getItem('token')
    try {
        const fileUrl = await axios.get('http://3.84.222.111:3000/user/download', { headers: { 'Authorization': token } })
        const fileName = 'myExpense.txt'
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl.data.fileUrl;
        downloadLink.setAttribute('download', fileName);
        downloadLink.click();
    } catch (error) {
        console.log(error)
    }

}

const OldDownloads = async () => {
    alert('success')
    try {
        const token = localStorage.getItem('token')
        const urls = await axios.get('http://3.84.222.111:3000/user/old-downloads', { headers: { 'Authorization': token } })
        console.log(urls.data)
        const container = document.createElement('div');
        for(let url of urls.data){
            const link = document.createElement('a')
            const paragraph = document.createElement('p');
            const text = document.createTextNode(url.url);
            paragraph.appendChild(text);
            link.href = url.url
            link.appendChild(paragraph)
            container.appendChild(link);
        }
        document.body.appendChild(container);
    } catch (error) {
        console.log(error)
    }
}

const rowsPerPageFunction = () => {
    const rowsPerPage = document.getElementById('rowsPerPage').value
    console.log(rowsPerPage)
    localStorage.setItem('rowsPerPage', rowsPerPage)
    window.location.reload()
}