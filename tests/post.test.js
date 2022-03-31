const request = require('supertest')
const app = require('../src/app')
const Post = require('../src/models/post')
const { 
    user1, user2,
    post1, post2, post3, post4, post5,
    setupDB
} = require('./fixtures/db')

beforeEach(setupDB)

test('Should create new post', async () => {
    const postTitle = "post created from jest - title"
    const postBody = "post created from jest - body"

    const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            title: postTitle,
            body: postBody
        })
        .expect(201)

    const post = await Post.findById(response.body._id)
    expect(post.title).toBe(postTitle)
    expect(post.body).toBe(postBody)
})

test('Should not create new post without authentication', async () => {
    await request(app)
        .post('/posts')
        .send({
            title: "test title",
            body: "test body"
        })
        .expect(401)
})
