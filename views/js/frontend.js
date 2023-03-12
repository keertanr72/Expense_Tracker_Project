const createUser = async (event) => {
    const userName = event.target.userName.value
    const email = event.target.email.value
    const phoneNumber = event.target.phoneNumber.value
    const password = event.target.password.value

    const userDetails = {
        userName,
        email,
        phoneNumber,
        password
    }

    const newUser = await axios.post('http://localhost:3000/') 
}