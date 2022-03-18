const express = require('express')
const mongoose = require('mongoose')

const userRoute = require('./routers/user')
const postRoute = require('./routers/post')

mongoose.connect(process.env.MONGODB_URL)

const app = express()
// Automatically parses all json to object
app.use(express.json())
app.use(userRoute)
app.use(postRoute)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

