const request = require('supertest')
const app = require('../src/app')
const Post = require('../src/models/post')
const { 
    user1, user2,
    post1, post2, post3, post4, post5,
    setupDB
} = require('./fixtures/db')

const posts = [post1, post2, post3, post4, post5]

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
        }).expect(401)
})

test('Should get all 5 posts from db', async () => {
    const response = await request(app).get('/posts').expect(200)
    expect(response.body.length).toBe(5)
})

test('Should get three posts by user1', async () => {
    const response = await request(app)
        .get(`/posts?username=${user1.username}`)
        .expect(200)

    response.body.forEach((post) => {
        expect(post.user.username).toBe(user1.username)
    })
})

test('Should get all posts ascending', async () => {
    const response = await request(app).get('/posts?sortBy=createdAt:asc').expect(200)

    for (let i=0; i<5; i++) {
        expect(response.body[i]._id).toBe(posts[i]._id.toString())
    }
})

test('Should get all posts descending', async () => {
    const response = await request(app).get('/posts?sortBy=createdAt:desc').expect(200)

    for (let i=0; i<5; i++) {
        expect(response.body[i]._id).toBe(posts[4-i]._id.toString())
    }
})

test('Should limit the posts number the client gets', async () => {
    const response = await request(app).get('/posts?limit=3').expect(200)
    expect(response.body.length).toBe(3)
})

test('Should get the 3rd and 4th posts through pagination', async () => {
    const response = await request(app).get('/posts?limit=2&skip=2').expect(200)

    expect(response.body[0]._id).toBe(post3._id.toString())
    expect(response.body[1]._id).toBe(post4._id.toString())
})

test('Should delete posts that is created by the current user', async () => {
    await request(app)
        .delete(`/posts/${post1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .expect(200)
    
    const post = await Post.findById(post1._id)
    expect(post).toBeNull()

})

test('Should not delete the post that is created by other users', async () => {
    await request(app)
        .delete(`/posts/${post1._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .expect(401)
})
