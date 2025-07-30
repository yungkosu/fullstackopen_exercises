const totalLikes = (blogs) => {
    if (blogs.length === 1) {
        return blogs[0].likes
    } else if (blogs.length > 1) {
        return blogs.reduce((accumulator, blog) => accumulator + blog.likes, 0)
    }
}

const favoriteBlog = (blogs) => {
    const favBlog = blogs.reduce((prev, curr) => {
        curr.likes > prev.likes ? curr : prev
    })
}

module.exports = {totalLikes, favoriteBlog}
