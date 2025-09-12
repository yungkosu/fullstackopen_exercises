import { useState } from "react"

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const addBlog = (event) => {
    event.preventDefault()
    
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    })
    
    // Reset form after submission
    setNewBlog({ title: '', author: '', url: '' })
  }

  const handleTitleChange = (event) => {
    setNewBlog({ ...newBlog, title: event.target.value })
  }

  const handleAuthorChange = (event) => {
    setNewBlog({ ...newBlog, author: event.target.value })
  }

  const handleUrlChange = (event) => {
    setNewBlog({ ...newBlog, url: event.target.value })
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input 
          value={newBlog.title}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        author:
        <input
          value={newBlog.author}
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url:
        <input
          value={newBlog.url}
          onChange={handleUrlChange}
        />
      </div>
      <button type="submit">create</button>
    </form>  
  )
}

export default BlogForm