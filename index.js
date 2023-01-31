const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', function getBody(req) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const phoneBookSize = persons.length

app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/info', (request, response) => {
    response.send(`
        <div>Phonebook has info for ${phoneBookSize} people</div>
        <div>${new Date()}</div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const personToReturn = persons.find(person => person.id === id)

    if (personToReturn) {
        response.json(personToReturn)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'malformed data'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const id = Math.ceil(Math.random() * (999999 - 1) + 1)

    const person = {
        id: id,
        name: body.name,
        number: body.number,
    }

    // console.log(person)

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})