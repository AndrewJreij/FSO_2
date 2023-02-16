const { indexOf } = require('lodash');
const mongoose = require('mongoose')
var _ = require('lodash');
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]


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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    initialBlogs,
    blogsInDb,
    usersInDb
}