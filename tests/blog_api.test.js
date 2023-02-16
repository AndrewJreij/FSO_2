const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('../utils/list_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')


describe.only('user tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('password', 10)
        const user = new User({ username: 'root', passwordHash: passwordHash, name: 'superuser' })
        await user.save()
    })

    test('user creation succeeds with a new username', async () => {
        const usersBefore = await helper.usersInDb()
        const passwordHash = await bcrypt.hash('password', 10)

        const newUser = new User({
            username: 'username',
            passwordHash: passwordHash,
            name: 'name'
        })

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.usersInDb()
        expect(usersAfter).toHaveLength(usersBefore.length + 1)

        const usernames = usersAfter.map(r => r.username)
        expect(usernames).toContain(
            newUser.username
        )
    })
})

describe('fetch checks on initial data', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are retruned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('blogs contain id property', async () => {
        const blogs = await helper.blogsInDb()

        blogs.map(blog =>
            expect(blog.id).toBeDefined())
    })

})

describe('post validation checks', () => {
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
        const blogsBefore = await helper.blogsInDb()

        const newBlogWithNoTitle = {
            author: "This is a test with no author",
            url: "http://testurl.com"
        }

        await api
            .post('/api/blogs')
            .send(newBlogWithNoTitle)
            .expect(400)

        const newBlogWithNoUrl = {
            title: "This is a test with no url",
            author: "Test Author"
        }

        await api
            .post('/api/blogs')
            .send(newBlogWithNoUrl)
            .expect(400)

        const blogsAfter = await helper.blogsInDb()

        expect(blogsAfter).toHaveLength(blogsBefore.length)

    })
})

describe('delete operation tests', () => {
    test('delete blog by id', async () => {
        const blogsBefore = await helper.blogsInDb()
        const blogToDelete = helper.initialBlogs[0]

        await api
            .delete(`/api/blogs/${blogToDelete._id}`)
            .expect(204)

        const blogsAfter = await helper.blogsInDb()

        expect(blogsAfter).toHaveLength(blogsBefore.length - 1)

        const titles = blogsAfter.map(r => r.title)
        expect(titles).not.toContain(blogToDelete.title)

    })
})

describe('update operations', () => {
    test('update blog with valid title', async () => {
        const blogsBefore = await helper.blogsInDb()
        const updatedBlog = { ...helper.initialBlogs[1], title: 'New title' }

        console.log(updatedBlog)
        await api
            .put(`/api/blogs/${updatedBlog._id}`)
            .send(updatedBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await helper.blogsInDb()
        const titles = blogsAfter.map(r => r.title)

        expect(titles).toContain(
            'New title'
        )
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})