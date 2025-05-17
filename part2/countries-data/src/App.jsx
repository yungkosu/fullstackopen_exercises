import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({countries}) => {
    if (countries.length > 10) {
        return (
            <p>Too many matches, specify another filter</p>
        )
    } else if (countries.length > 1) {
        return (
            <ul>
                {countries.map((country) => (
                    <li key={country.cca3}>{country.name.common}</li>
                ))}
            </ul>
        );
    } else if (countries.length === 1) {
        return (
            <Country country={countries[0]} />
        )

    } else {
        return (
        <p>no matches found</p>)
    }
}

const Country = ({ country }) => {
    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital[0]}</p>
            <p>Population: {country.population}</p>
            <h3>Languages:</h3>
            <ul>
                {Object.values(country.languages || {}).map((lang, index) => (
                    <li key={index}>{lang}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
        </div>
    );
};


const App = () => {
    const [countries, setCountries] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (search) {
            axios
                .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
                .then(response => {
                    setCountries(response.data)
                })
        }
    }, [search])


    const filteredCountries = search ? countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase())) : countries

    const handleChange = (event) => {
        setSearch(event.target.value)
    }

    return (
        <div>
            find countries: <input value={search} onChange={handleChange} />
            <Countries countries={filteredCountries} />
        </div>
    )
}

export default App