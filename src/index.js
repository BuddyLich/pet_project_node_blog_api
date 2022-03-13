const express = require('express')

const app = express()

// Automatically parses all json to object
app.use(express.json())


module.exports = app

const port = 3000

app.get('', (req, res) => {
    res.status(200).send({
        'message': 'Index'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})