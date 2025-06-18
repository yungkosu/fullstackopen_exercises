import { useState, useEffect } from 'react'
import Numbers from "./components/Numbers.jsx";
import contactService from './services/contacts.js'
import Notification from "./components/Notification.jsx";
import './index.css'

const FilterForm = ({filter, handleFilterField}) => {
    return (
        <form>
            <div>filter shown with<input value={filter} onChange={handleFilterField} /></div>
        </form>
    )
}

const PersonForm = ({name, number, handleNameChange, handlePhoneChange, addNumber}) => {
    return (
            <form>
                <div>name: <input value={name} onChange={handleNameChange} /></div>
                <div>number: <input value={number} onChange={handlePhoneChange} /></div>
                <div><button type="submit" onClick={addNumber}>add</button></div>
            </form>
    )

}



const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [filter, setFilter] = useState('')
    const [notification, setNotification] = useState({message :null, type: null})


    useEffect(() => {
        contactService.getAll()
            .then(initialContacts => {
                setPersons(initialContacts)
            })
    }, [])

    const filteredPersons = filter ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) : persons

    const addNumber = (event) => {
        event.preventDefault()

        const personObject = {
            name: newName,
            number: newPhone,
            id: String(persons.length + 1),
        }

        const person = persons.find(person => person.name === personObject.name)

        if (persons.some(person => person.name === personObject.name)) {
             const windowConfirm = window.confirm(`${personObject.name} is already added to phonebook. Would you like to update their phone number?`)
             const updatedPerson = {...person, number: newPhone}

            if (windowConfirm) {
                contactService
                    .update(person.id, updatedPerson)
                    .then(() => {
                            setPersons(persons.map((person) => person.id === updatedPerson.id ? updatedPerson : person))
                            setNotification({message: `${updatedPerson.name} has been updated`, type: 'success'})
                            setTimeout(() => {
                                {setNotification({message:null, type: null})}
                            }, 5000)
                            setNewName('')
                            setNewPhone('')

                        })
                    .catch((error) => {
                        console.log(error.response)
                        setNotification({message: error.response.data.error, type: 'error'})
                        setTimeout(() => {
                            {setNotification({message:null, type: null})}
                        }, 5000)
                    })
            }}
         else {
             contactService
                 .create(personObject)
                 .then(res => {
                     setPersons(persons.concat(res))
                     setNotification({message:`${personObject.name} has been added.`, type: 'success'})
                     setTimeout(() => {setNotification({message:null, type: null})}, 5000)
                     setNewName('')
                     setNewName('')
                     setNewPhone('')
                 })
                .catch((error) => {
                        console.log(error.response)
                        setNotification({message: error.response.data.error, type: 'error'})
                        setTimeout(() => {
                            {setNotification({message:null, type: null})}
                        }, 5000)
                    })
            }}       
         
    
const handleNameChange = (event) => {
        setNewName(event.target.value)
}


const handlePhoneChange = (event) => {
        setNewPhone(event.target.value)
    }


    const handleFilterField = (event) => {
        setFilter(event.target.value)
    }

    const deleteNumber = (id) => {
        const person = persons.find(person => person.id === id)

        if (person && window.confirm(`Are you sure you want to delete ${person.name}?`)) {
            contactService
                .destroy(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id))
                    setNotification({message:`${person.name} has been deleted.`, type: 'success'})
                    setTimeout(() => {setNotification({message:null, type: null})}, 5000)
                })
        }
    }
return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notification.message} type={notification.type} />
            <FilterForm value={filter} handleFilterField={handleFilterField} />
            <h2>add a new</h2>
            <PersonForm name={newName} number={newPhone} handleNameChange={handleNameChange} handlePhoneChange={handlePhoneChange}  addNumber={addNumber}/>
            <h2>Numbers</h2>
            < Numbers persons={filteredPersons} remove={deleteNumber}/>
        </div>
    )
}
export default App