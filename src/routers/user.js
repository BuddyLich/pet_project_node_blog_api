const express = require('express')
const Post = require('../models/post')
const User = require('../models/user')

const router = new express.Router()

// Incomplete
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
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

// incomplete
router.get('/users/:username', async (req, res) => {
    if (!req.params.username) {
        return res.status(400).send({ error: "Username cannot be empty"})
    }

    const user = await User.findOne({ username: req.params.username })

    if (!user) {
        return res.status(404).send()
    }

    // =================
    // definitely not a good practice. Will be fixed later.
    await user.populate('posts')
    userJSON = user.toJSON()
    userJSON["numberOfPost"] = user.posts.length

    return res.status(200).send(userJSON)
    // ===================
    
})

module.exports = router
