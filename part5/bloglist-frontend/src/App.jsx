import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'




const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


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



    const addBlog = (event) => {
        event.preventDefault()

        const blogObject = {
            title: title,
            author: author,
            url: url,
        }

        try {
        blogService
            .create(blogObject)
            .then(savedBlog => {
                setBlogs(blogs.concat(savedBlog))
        setNotificationMessage(`a new blog ${savedBlog.title} by ${savedBlog.author} has been added`)
        setNotificationType('success')
        setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
            })} catch (error) {
        console.log(error)

            }

    }


return (
  <div>
    {!user ? <h2>log in to application</h2> : <h2>blogs</h2>}
    < Notification message={notification} type={notificationType} />
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
        <p>{user.name} logged in</p><button onClick={handleLogout}>logout</button>
        </div>
        <h2>create new</h2>
        <BlogForm addBlog={addBlog} handleTitleChange={({target}) => setTitle(target.value)} handleAuthorChange={({target}) => setAuthor(target.value)} handleUrlChange={({target}) => setUrl(target.value)} newAuthor={author} newTitle={title} newUrl={url}/>
        <ul>
          {blogs.map(blog => (
            <li key={blog.id}>
              <Blog blog={blog}/>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)

}
export default App