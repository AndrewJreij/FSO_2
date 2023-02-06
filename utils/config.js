require('dotenv').config()

const mongoUrl = process.env.MONGODB_URI_BLOG
const PORT = process.env.PORT_BLOG

module.exports = {
    mongoUrl,
    PORT
}