const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, user1, setupDB } = require('./fixtures/db')

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
