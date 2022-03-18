const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxLength: 60,
        minlength: 4
    },
    body: {
        type: String,
        trim: true,
        required: true,
        maxLength: 10000,
        minLength: 4,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema, 'Post')

module.exports = Post
