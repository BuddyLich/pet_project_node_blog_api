const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Post = require('../../src/models/post')

const userOneId = new mongoose.Types.ObjectId()
const user1 = {
    _id: userOneId,
    username: 'walter',
    email: 'walterwhite@gmail.com',
    password: 'testtest123',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const user2 = {
    _id: userTwoId,
    username: 'jesse',
    email: 'jessepinkman@gmail.com',
    password: 'testtest321',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const post1 = {
    _id: new mongoose.Types.ObjectId(),
    title: "Test post 1",
    body: "Test post 1 body",
    user: user1._id
}

const post2 = {
    _id: new mongoose.Types.ObjectId(),
    title: "Test post 2",
    body: "Test post 2 body",
    user: user1._id
}

const post3 = {
    _id: new mongoose.Types.ObjectId(),
    title: "Test post 3",
    body: "Test post 3 body",
    user: user1._id
}

const post4 = {
    _id: new mongoose.Types.ObjectId(),
    title: "Test post 4",
    body: "Test post 4 body",
    user: user2._id
}
const post5 = {
    _id: new mongoose.Types.ObjectId(),
    title: "Test post 5",
    body: "Test post 5 body",
    user: user2._id
}

const setupDB = async () => {
    await User.deleteMany()
    await Post.deleteMany()

    await new User(user1).save()
    await new User(user2).save()

    await new Post(post1).save()
    await new Post(post2).save()
    await new Post(post3).save()
    await new Post(post4).save()
    await new Post(post5).save()
}

module.exports = { 
    user1, user2,
    post1, post2, post3, post4, post5,
    setupDB
}
