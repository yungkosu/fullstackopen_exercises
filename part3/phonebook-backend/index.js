require('dotenv').config()
const express = require('express')
const morgan = require("morgan")
const app = express()
const Person = require('./models/person')



const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }
  next(error)
}


app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))
app.use(errorHandler)

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

app.get('/api/persons/:id', (request, response, next) => {
Person.findById(request.params.id)
.then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
}).catch(error => next(error))
})

app.get('/api/info/', (request, response) => {
  Person.collection.countDocuments() 
  .then(count => {
      response.send(`<p>Phonebook has info for ${count} people</p><p>${request.requestTime.toString()}</p>`)
  })
})

app.post('/api/persons', (request, response, next) => {
  
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
.catch(error => {next(error)})
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
  response.status(204).end()
})
.catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})