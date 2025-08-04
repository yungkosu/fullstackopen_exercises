const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('the right amount of blogs is returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 3)
})

test('each blog contains parameter named id', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body)
  for (const blog of response.body) {
    assert.ok('id' in blog, 'Each blog should have an id field')
  }
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Kuba',
    url: 'https://kuba-api.herokuapp.com/api/blogs',
    likes: 5,
  }

  // Get initial number of blogs
  const initialResponse = await api.get('/api/blogs')
  const initialLength = initialResponse.body.length

  // Add new blog
  await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

  // Get updated blogs
  const updatedResponse = await api.get('/api/blogs')
  assert.strictEqual(updatedResponse.body.length, initialLength + 1)

  // Check if new blog title exists in response
  const titles = updatedResponse.body.map(blog => blog.title)
  assert.ok(titles.includes(newBlog.title), 'New blog title should be in response')
})

after(async () => {
  await mongoose.connection.close()
})
