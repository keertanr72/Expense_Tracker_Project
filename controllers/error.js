exports.getError = (req, res) => {
    res.status(404).write('<h1>PAGE NOT FOUND</h1>')
}