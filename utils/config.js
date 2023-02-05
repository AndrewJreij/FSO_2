require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_URI_PERSON = process.env.MONGODB_URI_PERSON

module.exports = {
    MONGODB_URI,
    MONGODB_URI_PERSON,
    PORT
}