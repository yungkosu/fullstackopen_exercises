const {test, after} = require('node:test')
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

test('blog contains parameter named id', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body);
  for (const blog of response.body) {
    assert.ok('id' in blog, 'Each blog should have an id field');
  }
  })





after(async () => {
  await mongoose.connection.close()
})