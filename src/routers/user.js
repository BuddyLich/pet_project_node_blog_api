const express = require('express')
const Post = require('../models/post')
const User = require('../models/user')

const router = new express.Router()

// Incomplete
router.post('/user', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        // need to add token operation here
        res.status(201).send({ user }) 
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

module.exports = router
