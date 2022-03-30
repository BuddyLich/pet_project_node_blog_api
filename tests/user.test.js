const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const User = require('../src/models/user')
const { user1, user2, setupDB } = require('./fixtures/db')

beforeEach(setupDB)

test('Should create a new user', async () => {
    const response = await request(app).post('/users').send({
        username: 'johnsmith',
        email: 'johnsmith@gmail.com',
        password: 'testtest567'
    }).expect(201)

    const user = await User.findOne({ username: response.body.user.username })
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            username: 'johnsmith',
            email: 'johnsmith@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('testtest567')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200)

    await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200)

    const user = await User.findOne({ username: user1.username })
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: 'test@example.com',
        password: 'randomPSWD123'
    }).expect(400)
})

test('Should logout user', async () => {
    await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findOne({ username: user1.username })
    expect(user.tokens.length).toBe(0)
})

test('Should logout all user tokens', async () => {
    // login user2 three times and create more tokens
    for (i=0;i<3;i++) {
        await request(app).post('/users/login').send({
            email: user2.email,
            password: user2.password
        }).expect(200)
    }

    await request(app)
        .post('/users/logoutAll')
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findOne({ username: user2.username })
    expect(user.tokens.length).toBe(0)
})

test('Should receive logged in user information', async () => {
    const response = await request(app).get('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    expect({ 
        username: response.body.username,
        email: response.body.email 
    }).toEqual({
        username: user1.username,
        email: user1.email
    })
})

test('Should not get current user info without authentication', async () => {
    await request(app).get('/users/me').send().expect(401)
})

test('Shoud get user profile with username', async () => {
    const response = await request(app)
        .get(`/users/${user2.username}`)
        .send()
        .expect(200)

    expect({ 
        username: response.body.username,
        email: response.body.email 
    }).toEqual({
        username: user2.username,
        email: user2.email
    })
})

test('Should update current user profile', async () => {
    const updatedEmail = 'test@example.com'
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            email: updatedEmail,
        })
        .expect(200)
        
    const user = await User.findOne({ username: user1.username })
    expect(user.email).toBe(updatedEmail)
})

test('Should not be able to update profile when not authenticated', async () => {
    await request(app)
    .patch('/users/me')
    .send({
        email: 'test@example.com',
    })
    .expect(401)
})
