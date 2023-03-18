const forgotPassword = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    alert(email)
    await axios.post('http://localhost:3000/password/forgot-password', {email})
}