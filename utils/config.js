require('dotenv').config()

const mongoUrl = process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_BLOG_TEST
    : process.env.MONGODB_URI_BLOG

const PORT = process.env.PORT_BLOG

module.exports = {
    mongoUrl,
    PORT
}