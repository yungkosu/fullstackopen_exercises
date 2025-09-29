import { useState } from "react"

const Blog = ({ blog, handleLike, handleRemove}) => {

  const [details, setDetails] = useState(false)

    const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
    }


return (
    <div style={blogStyle}>
      {details ? (
        <div>
          <div>{blog.title} {blog.author}</div>
          <div>URL: {blog.url}</div>
          <div>Likes: {blog.likes} <button onClick={() => handleLike(blog.id)}>like</button></div>
          <div>{blog.author}</div>
          <button onClick={() => setDetails(!details)}>hide</button>
          <button onClick={() => handleRemove(blog)}>remove</button>
        </div>
      ) : (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setDetails(!details)}>view</button>
        </div>
      )}
    </div>  
  )
}
export default Blog