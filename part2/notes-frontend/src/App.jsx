import {useState, useEffect} from 'react'
import noteService from './services/notes';
import Note from './components/Note'
import Notification from "./components/Notification.jsx";
import Footer from "./components/Footer.jsx";


const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState("")
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState('some error happened')


    useEffect(() => {
        noteService
            .getAll()
            .then(res => {
            setNotes(res.data)
        })
    },[])

    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
            id: String(notes.length + 1),
        }

        noteService
            .create(noteObject)
            .then(response => {
                setNotes(notes.concat(response.data))
                setNewNote('')
            })
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
            setErrorMessage(`Note ${note.content} was already removed from the server`
            )
            setTimeout(() => {setErrorMessage(null)}, 5000)
            setNotes(notes.filter(n => n.id !== id))
        })
}


    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => setShowAll(!showAll)}
                >
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <Note 
                    key={note.id} 
                    note={note}
                    toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                )}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote}
                onChange={handleNoteChange}/>
                <button type="submit">save</button>
            </form>
            <Footer />
        </div>
    )
}

export default App