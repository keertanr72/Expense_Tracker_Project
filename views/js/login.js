const loginUser = async (event) => {
    const email = event.target.email.value
    const password = event.target.password.value

    event.preventDefault()

    document.getElementById('loginSpinner').innerHTML = 
    `<strong>Loading...</strong>
    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>`

    const obj = {
        email: email,
        password: password
    }
    
    try {
        console.log(obj)
        const check = await axios.post('http://localhost:3000/user/login', obj)
        alert('success')
        document.getElementById('loginSpinner').innerHTML = ''
        console.log(check)
    } catch (error) {
        document.getElementById('loginSpinner').innerHTML = ''
        document.getElementById('loginFormId').innerHTML += `<p style="color: red;">${error}</p>`
        document.getElementById('loginFormId').innerHTML += `<p style="color: red;">Email and password doesn't match</p>`
        console.log(error)
    } 
}