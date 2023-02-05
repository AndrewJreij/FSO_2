
const app = require('./app') // the actual Express application
const config = require('./utils/config')
const Note = require('./models/note')
const config = require('./utils/config')

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.listen(PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})