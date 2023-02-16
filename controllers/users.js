const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
require('express-async-errors')


usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, password, name } = request.body

    if (password.length < 3) {
        return response.status(400).json({ error: 'Password must be atleast 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username: username,
        passwordHash: passwordHash,
        name: name
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter