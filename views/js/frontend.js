const createUser = async (event) => {
    let emailRepeat = false
    event.preventDefault()
    const check = await axios.get(('http://localhost:3000/user/details'))
    check.data.forEach(data => {
                if(data.email === event.target.email.value){
                    emailRepeat = true
                    return
                }
    });
    if(emailRepeat){
        document.getElementById('signUpFormId').innerHTML += '<p style="color: red;">This email EXISTS!!</p>'
        return
    }

    if (!/[6-9]/.test(event.target.phoneNumber.value[0]) || event.target.phoneNumber.value.length !== 10) {
        document.getElementById('signUpFormId').innerHTML += `<p style="color: red;">Enter a valid phone number</p>`;
        return;
    }

    if(event.target.password.value.length < 7){
        document.getElementById('signUpFormId').innerHTML += '<p style="color: red;">Password should contail atleast 6 digits!!</p>'
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
            alert('success')
            // window.location.href = "/views/html/login.html"
        }
    }
    catch(err){
        console.log(err)
    }
}