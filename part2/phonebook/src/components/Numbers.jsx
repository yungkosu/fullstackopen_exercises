const Numbers = ({persons, remove}) => {
    return (
        persons.map((person => {
            return (
                <li key={person.id}>
                    {person.name} {person.number}
                    <button onClick={() => remove(person.id)}>delete</button>
                </li>
            )
        })))
}

export default Numbers