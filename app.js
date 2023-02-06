const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app