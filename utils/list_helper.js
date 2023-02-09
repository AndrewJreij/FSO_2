const { indexOf } = require('lodash');
var _ = require('lodash');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const likes = blogs.map(blog => blog.likes)

    const reducer = (sum, item) => {
        return sum + item
    }

    return likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const { title, author, likes } = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)

    return {
        title: title,
        author: author,
        likes: likes
    }
}

const mostBlogs = (blogs) => {
    const auth = _.groupBy(blogs, 'author')
    const entries = Object.values(auth)

    const size = entries.map(entry => entry.length)
    const max = Math.max(...size)

    const author = entries[size.indexOf(max)][0].author

    return {
        author: author,
        blogs: max
    }
}

const mostLikes = (blogs) => {
    const auth = _.groupBy(blogs, 'author')
    const entries = Object.values(auth)

    let a = [];

    entries.forEach(entry => {
        let likes = entry.reduce((sum, blog) => sum + blog.likes, 0)

        a.push({ author: entry[0].author, likes: likes })
    })

    const { author, likes } = a.reduce((max, blog) => max.likes > blog.likes ? max : blog)

    return {
        author: author,
        likes: likes,
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}