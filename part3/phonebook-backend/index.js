require('dotenv').config()
const express = require('express')
const morgan = require("morgan")
const app = express()
const Person = require('./models/person')
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

app.use((request, response, next) => {
  request.requestTime = new Date();
  next();
});

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
Person.findById(request.params.id).then(person => {
  response.json(person)
})
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${request.requestTime.toString()}</p>`)
})

const generateId = () => {
  let entry_id = Math.floor(Math.random() * 999999 -  100000 + 1)
  return entry_id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'contact name information missing',
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'contact number information missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

person.save().then(savedPerson => {
  response.json(savedPerson)
})
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})