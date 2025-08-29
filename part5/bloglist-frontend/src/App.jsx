import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
        setErrorMessage('Wrong Credentials')
        setTimeout(() => {
        setErrorMessage(null)
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
            content: newNote,
            important: Math.random() < 0.5,
            id: String(notes.length + 1),
        }

        try {
        blogService
            .create(noteObject)
            .then(savedNote => {
                setNotes(notes.concat(savedNote))
                setNewNote('')
            })} catch (error) {
              console.log(error)
            }
    }
    
const handleNoteChange = (event) => {
        setNewNote(event.target.value)

}


return (
  <div>
    {!user ? <h2>log in to application</h2> : <h2>blogs</h2>}
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