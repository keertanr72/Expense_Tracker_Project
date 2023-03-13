const createUser = async (event) => {
    let emailRepeat = false
    event.preventDefault()
    const check = await axios.get(('http://localhost:3000/user/details'))
    alert('Submitted')
    check.data.forEach(data => {
                if(data.email === event.target.email.value){
                    emailRepeat = true
                    return
                }
    });
    if(emailRepeat){
        document.getElementById('addHere').innerHTML = 'This email EXISTS!!'
        return
    }

    const userName = event.target.userName.value
    const email = event.target.email.value
    const phoneNumber = event.target.phoneNumber.value
    const password = event.target.password.value

    const userDetails = {
        userName: userName,
        email: email,
        phoneNumber: phoneNumber,
        password: password
    }

    const data = await axios.post('http://localhost:3000/user/details', userDetails)
    try{
        if(data.status === 200){
            // window.location.href = "/views/html/login.html"
        }
    }
    catch(err){
        console.log(err)
    }
}