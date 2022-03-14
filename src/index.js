const express = require('express')
const mongoose = require('mongoose')

const app = express()

// Automatically parses all json to object
app.use(express.json())
mongoose.connect(process.env.MONGODB_URL)

module.exports = app

const port = process.env.PORT || 3000

app.get('', (req, res) => {
    res.status(200).send({
        'message': 'Index'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})