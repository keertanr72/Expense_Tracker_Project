const createUser = async (event) => {
    const userName = event.target.userName.value
    const email = event.target.email.value
    const phoneNumber = event.target.phoneNumber.value
    const password = event.target.password.value
    let emailRepeat = false
    event.preventDefault()
    try {
        const check = await axios.get(('http://localhost:3000/user/sign-up'))
        check.data.forEach(data => {
            if (data.email === email) {
                emailRepeat = true
                return
            }
        });
    }
    catch (err) {
        console.log(err)
    }

    if (emailRepeat) {
        document.getElementById('signUpFormId').innerHTML += '<p style="color: red;">This email EXISTS!!</p>'
        return
    }

    if (!/[6-9]/.test(phoneNumber[0]) || phoneNumber.length !== 10) {
        document.getElementById('signUpFormId').innerHTML += `<p style="color: red;">Enter a valid phone number</p>`;
        return;
    }

    const userDetails = {
        userName: userName,
        email: email,
        phoneNumber: phoneNumber,
        password: password
    }

    const data = await axios.post('http://localhost:3000/user/sign-up', userDetails)
    try {
        if (data.status === 200) {
            alert('success')
            // window.location.href = "/views/html/login.html"
        }
    }
    catch (err) {
        console.log(err)
    }
}