import { useState } from 'react'


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

const Numbers = ({persons}) => {
    return (
        persons.map((person => {
            return (
                <p key={person.id}>{person.name} {person.number}</p>
            )
        }))
    )

}


const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
    const [newName, setNewName] = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [filter, setFilter] = useState('')


    const filteredPersons = filter ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) : persons

    const addNumber = (event) => {
        event.preventDefault()

        const personObject = {
            name: newName,
            number: newPhone,
            id: persons.length + 1,
        }

         if (persons.some(person => person.name === personObject.name)) {
             alert(`${personObject.name} is already added to phonebook`)
         } else {
             setPersons(persons.concat(personObject))
         }
        setNewName('')
        setNewPhone('')

    }

const handleNameChange = (event) => {
        setNewName(event.target.value)
}


const handlePhoneChange = (event) => {
        setNewPhone(event.target.value)
    }


    const handleFilterField = (event) => {
        setFilter(event.target.value)
    }



    return (
        <div>
            <h2>Phonebook</h2>
            <FilterForm value={filter} handleFilterField={handleFilterField} />
            <h2>add a new</h2>
            <PersonForm name={newName} number={newPhone} handleNameChange={handleNameChange} handlePhoneChange={handlePhoneChange}  addNumber={addNumber} />
            <h2>Numbers</h2>
            < Numbers persons={filteredPersons} />
        </div>
    )
}

export default App