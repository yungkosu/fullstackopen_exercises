import {useState, useEffect} from 'react'
import noteService from './services/notes';
import Note from './components/Note'
import Notification from "./components/Notification.jsx";
import Footer from "./components/Footer.jsx";
import LoginForm from './components/LoginForm.jsx'
import NoteForm from './components/NoteForm.jsx'
import loginService from '../services/login.js'


const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState("")
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)


const handleLogin = async (event) => {
    event.preventDefault()

    try {
        const user = await loginService.login({
            username, password,
        })


        window.localStorage.setItem(
          'loggedNoteAppUser', JSON.stringify(user)
        )
        
        noteService.setToken(user.token)
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

    useEffect(() => {
        noteService
            .getAll()
            .then(res => {
            setNotes(res.data)
        })
    },[])

    useEffect(() => {
      const loggedUserJSON = window.localStorage(getItem('loggedNoteAppUser'))
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        noteService.setToken(user.token)
      }

    })
    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
            id: String(notes.length + 1),
        }

        try {
        noteService
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


const notesToShow = showAll ? notes : notes.filter(note => note.important)

const toggleImportanceOf = (id) => {
    const note = notes.find(note => note.id === id)
    const changedNote = {...note, important: !note.important}

    noteService
        .update(id, changedNote)
        .then(response => {
            setNotes(notes.map(note =>  note.id === id ? response.data :note))
        })
        .catch(error => {
            setErrorMessage(`Note ${note.content} was already removed from the server`)
            setTimeout(() => {setErrorMessage(null)}, 5000)
            setNotes(notes.filter(n => n.id !== id))
        })
}


return (
  <div>
    <h1>Notes</h1>
    <Notification message={errorMessage} />

    {user === null ? (
      <LoginForm handleLogin={handleLogin} username={username} password={password} usernameChange={({ target }) => setUsername(target.value)} passwordChange={({ target }) => setPassword(target.value)}/>
    ) : (
      <div>
        <p>{user.name} logged in</p>
        {<NoteForm addNote={addNote} handleNoteChange={handleNoteChange}/>}

        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>

        <ul>
          {notesToShow.map((note, i) => (
            <Note
              key={i}
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          ))}
        </ul>
      </div>
    )}

    <Footer />
  </div>
)}



export default App