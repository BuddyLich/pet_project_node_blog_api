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

test('Should update the post1', async () => {
    const postTitle = "Updated post title"
    const postBody = "Updated post body"

    await request(app)
        .patch(`/posts/${post1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            title: postTitle,
            body: postBody
        }).expect(200)
})

test('Should not update posts without authentication', async () => {
    await request(app)
        .patch(`/posts/${post1._id}`)
        .send({
            title: "test title",
            body: "test body"
        }).expect(401)
})

test('Should not update posts created by other user', async () => {
    // proves that post1 is created by user1
    const post = await Post.findById(post1._id)
    expect(post.user).toEqual(user1._id)
    
    await request(app)
        .patch(`/posts/${post1._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send({
            title: "test title",
            body: "test body"
        }).expect(404)
})
