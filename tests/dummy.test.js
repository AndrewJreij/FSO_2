const helper = require('../utils/list_helper')
const supertest = require('supertest')

test('dummy returns one', () => {
    const blogs = []

    const result = helper.dummy(helper.initialBlogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the likes of that', () => {
        const result = helper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
})

describe('blog with highest amount of likes', () => {
    const blogWithMostLikes = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
    }

    test('when a blog has the most amount of likes', () => {
        const result = helper.favoriteBlog(helper.initialBlogs)
        expect(result).toEqual(blogWithMostLikes)
    })
})

describe('author with the most amount of blogs', () => {
    const authorWithMostBlogs = {
        author: "Robert C. Martin",
        blogs: 3
    }

    test('when an author has the most amount of blogs', () => {
        const result = helper.mostBlogs(helper.initialBlogs)
        expect(result).toEqual(authorWithMostBlogs)
    })
})

describe('author with the most amount of likes', () => {
    const authorWithMostLikes = {
        author: "Edsger W. Dijkstra",
        likes: 17
    }

    test('when an author has the most amount of likes', () => {
        const result = helper.mostLikes(helper.initialBlogs)
        expect(result).toEqual(authorWithMostLikes)
    })
})
