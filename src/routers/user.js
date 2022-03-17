const express = require('express')
const Post = require('../models/post')
const User = require('../models/user')

const router = new express.Router()

// Incomplete
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = user.generateAuthToken()
        res.status(201).send({ user, token }) 
    } catch (e) {
        // temporary fix, need to customise the error msg later
        res.status(400).send({error: e.message})
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({error: e.message})
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
