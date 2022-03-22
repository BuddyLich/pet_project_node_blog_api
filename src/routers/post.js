const express = require('express')
const Post = require('../models/post')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/posts', auth, async (req, res) => {
    const post = new Post({
        ...req.body,
        user: req.user._id
    })

    try {
        await post.save()
        res.status(201).send(post)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/posts/:id', auth, async (req, res) => {
    const _id = req.params.id

    const updates = Object.keys(req.body)
    const postFields = Object.keys(Post.schema.obj)

    // filter out user field because the author of the post should not be changed
    const allowUpdates = postFields.filter(field => field !== "user")
    const isValidOperation = updates.every(update => allowUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates." })
    }
    
    try {
        const post = await Post.findOne({ _id, user: req.user._id })

        if (!post) {
            res.status(404).send()
        }
        
        updates.forEach((update) => {
            post[update] = req.body[update]
        })

        await post.save()
        res.send(post)

    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/posts/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).send()
        }

        return res.send(post)
    } catch (e) {
        return res.status(500).send(e)
    }
})

router.delete('/posts/:id', auth, async (req, res) => {
    const _id = req.params.id 
    try {
        const post = await Post.findOne({ _id, user: req.user._id })
        if (!post) {
            return res.status(404).send()
        }

        await post.remove()
        return res.send()

    } catch (e) {
        return res.status(500).send(e)
    }
})

module.exports = router
