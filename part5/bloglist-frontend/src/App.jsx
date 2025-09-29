import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'




const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);


    useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])


    useEffect(() => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      }

    }, [])


    const handleLogin = async (event) => {
    event.preventDefault()

    try {

        const user = await loginService.login({
            username, password,
        })

        window.localStorage.setItem(
          'loggedBlogAppUser', JSON.stringify(user)
        )
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
    } catch (exception) {
        setNotificationMessage('Wrong Credentials')
        setNotificationType('error')
        setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
}


const handleLogout = async (event) => {
  try {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  } catch (error) {
    console.log(error)
  }
}



    const addBlog = async (blogObject) => {

        try {
        const savedBlog = await blogService.create(blogObject)
        setBlogs(blogs.concat(savedBlog))
        setNotificationMessage(`a new blog ${savedBlog.title} by ${savedBlog.author} has been added`)
        setNotificationType('success')
        setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
            } catch (error) {
        console.log(error)

            }

    }


const addBlogLikes = async (id) => {
  try {
    const blog = blogs.find(blog => blog.id === id)
    const changedBlog = {...blog, likes: blog.likes + 1}
    await blogService.update(id, changedBlog)
    setBlogs(blogs.map(blog =>  blog.id === id ? changedBlog : blog))
  } catch (error) {
            setNotificationMessage(`Blog ${blogs.title} was already removed from the server`)
            setTimeout(() => {setErrorMessage(null)}, 5000)
            setBlogs(blogs.filter(n => n.id !== id))
        }
  }


const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        usernameChange={({ target }) => setUsername(target.value)}
        passwordChange={({ target }) => setPassword(target.value)}
        handleLogin={handleLogin}
      />
    </Togglable>
  )


  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" reference={blogFormRef}>
      <BlogForm
       createBlog={addBlog} />
    </Togglable>
  )



const removeBlog = async (blogObject) => {
  try {   
    await blogService.remove(blogObject.id)  // Change this - pass blogObject.id instead of blogObject
    setBlogs(filteredBlogs => filteredBlogs.filter((blog) => blog.id !== blogObject.id))
    setNotificationMessage(`blog ${blogObject.title} by ${blogObject.author} has been removed`)
    setNotificationType('success')
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 5000)
  } catch (error) {
    console.log(error)
  }
}

  
   const sortedBlogs = [...blogs].sort((a,b) => b.likes - a.likes);

return (
  <div>
    {!user ? <h2>log in to application</h2> : <h2>blogs</h2>}
    <Notification message={notification} type={notificationType} />

    {!user && (
      <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        usernameChange={({ target }) => setUsername(target.value)}
        passwordChange={({ target }) => setPassword(target.value)}
      />
    )}

    {user && (
      <div>
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
        </div>
        {blogForm()}
        <ul>
          {sortedBlogs.map(blog => (
            <li key={blog.id}>
              <Blog
                blog={blog}
                handleLike={addBlogLikes}
                handleRemove={removeBlog}
              />
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
}
export default App