const forgotPassword = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const status = await axios.post('http://localhost:3000/password/forgot-password', {email})
    console.log(status.data.message)
    if(status.data.message === 'successfull'){
        console.log('hello')
        alert(email)
        window.location.href = "/views/html/redirectEmail.html"
    }
    
}

const changePassword = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const newPassword = event.target.password.value
    const update = await axios.post('http://localhost:3000/password/update-password', {email, password: newPassword})
    if(update.status === 200){
        window.location.href = "/views/html/login.html"
    }
}