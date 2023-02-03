require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', function getBody(req) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        console.log(persons)
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

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'malformed data'
        })
    }

    var existingPerson

    Person.find({ name: body.name })
        .then(person => {
            if (person) {
                existingPerson = response.json
            }
        })
        .catch(error => next(error))

    if (!existingPerson) {
        const newPerson = new Person({
            name: body.name,
            number: body.number
        })

        newPerson.save().then(savedPerson => {
            response.json(savedPerson)
        })
            .catch(error => next(error))
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: 'Name shorter than 5 letters. Numbers should have forms 09-1234556 or 040-22334455' })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})