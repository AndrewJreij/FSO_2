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

    const returnedObj = { title, author, likes }

    return returnedObj
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}