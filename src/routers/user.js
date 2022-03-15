const express = require('express')
const Post = require('../models/post')
const User = require('../models/user')

const router = new express.Router()

// Incomplete
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        // need to add token operation here
        res.status(201).send({ user }) 
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/:username', async (req, res) => {
    if (!req.params.username) {
        return res.status(400).send({ error: "Username cannot be empty"})
    }

    const user = await User.findOne({ username: req.params.username })

    if (!user) {
        return res.status(404).send()
    }

    userPostNum = await Post.count({ user: user._id })

    const userInfo =  {
        username: user.username,
        email: user.email,
        createdPosts: userPostNum
    }
    return res.status(200).send(userInfo)
})

module.exports = router
