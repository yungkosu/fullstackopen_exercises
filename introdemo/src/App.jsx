const Hello = (props) => {
    return (
        <div>
            <p>Hello {props.name}</p>
        </div>
    )
}




const App = () => {
    return (
        <div>
            <h1>Greetings</h1>
            <Hello name={"Kuba"}/>
            <Hello name={"Martynka"}/>
            <Hello name={"Krysia"}/>

        </div>
    )
}

export default App