const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true
})

// Setup the relationship between User and Post
userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'user'
})

const User = mongoose.model('User', userSchema)

module.exports = User
