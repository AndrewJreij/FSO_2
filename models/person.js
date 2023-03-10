require('dotenv').config()

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI_PERSON

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5
    },
    number: {
        type: String,
        validate: {
            validator: function (v) {
                return /\d{2,3}-\d{6,8}/.test(v)
            },
            message: 'Invalid Number'
        },
        require: [true, 'User phone number is required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

