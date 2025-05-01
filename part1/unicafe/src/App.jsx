import { useState } from 'react'

const Button = ({onClick, text}) => {
    return(
        <button onClick={onClick}>{text}</button>
    )
}

const Statistics = ({good, neutral, bad, total, average, positive}) => {

    if (good === 0 && neutral === 0 && neutral === 0) {
        return (
            <p>no feedback given</p>
        )
    }

    return (
        <div>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={total} />
            <StatisticLine text="average" value={average} />
            <StatisticLine text="positive" value={positive} />
        </div>
    )
}


    const StatisticLine = ({text, value}) => {

    return (
        <p>{text} {text === "positive" ? `${value}%`  : value}</p>
    )
    }


const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const [total, setTotal] = useState(0)


    const collectGood = () => {
        let updatedGood = good + 1
        setGood(updatedGood)
        setTotal(updatedGood + bad + neutral)
    }

    const collectNeutral = () => {
        let updatedNeutral = neutral + 1
        setNeutral(updatedNeutral)
        setTotal(updatedNeutral + bad + good)
    }

    const collectBad = () => {
        let updatedBad = bad + 1
        setBad(updatedBad)
        setTotal(updatedBad + neutral + good)
    }


    return (
        <div>
            <h1>give feedback</h1>
            <Button onClick={collectGood} text={"good"}/>
            <Button onClick={collectNeutral} text={"neutral"}/>
            <Button onClick={collectBad} text={"bad"}/>
            <h1>statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} total={total} average={(good - bad) /  total} positive={(good / total) * 100 }/>

        </div>
    )
}

export default App