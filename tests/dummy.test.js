const helper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are retruned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('succesfully create a blog in db', async () => {
    const newBlog = {
        title: "This is a test",
        author: "Test Author",
        url: "http://testurl.com",
        likes: 2
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
        'This is a test'
    )
})

test('blogs contain id property', async () => {
    const blogs = await helper.blogsInDb()

    blogs.map(blog =>
        expect(blog.id).toBeDefined())
})

test('missing likes property defaults to 0', async () => {
    const newBlog = {
        title: "This is a test with no likes",
        author: "Test Author",
        url: "http://testurl.com"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const blogWithNoLikes = response.body.find(blog => blog.title === 'This is a test with no likes')
    expect(blogWithNoLikes.likes).toEqual(0)
})

test('create blog with missing url or author fails', async () => {
    const newBlogWithNoTitle = {
        author: "Test Author",
        url: "http://testurl.com"
    }

    await api
        .post('/api/blogs')
        .send(newBlogWithNoTitle)
        .expect(400)

    const newBlogWithNoUrl = {
        title: "This is a test with no likes",
        author: "Test Author"
    }

    await api
        .post('/api/blogs')
        .send(newBlogWithNoUrl)
        .expect(400)

    const blogsAfter = await helper.blogsInDb()


    expect(blogsAfter).toHaveLength(helper.initialBlogs.length)

})

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