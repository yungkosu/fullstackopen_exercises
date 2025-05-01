const Header = ({name}) => {
    return (
        <h1>{name}</h1>
    )
}

const Part = ({name, exercises}) => {
    return (
        <p>{name} {exercises}</p>
    )
}

const Content = ({parts}) => {
    return (
        <div>
            {parts.map((part => {
                return (
                    <Part key={part.id} name={part.name} exercises={part.exercises} />
                )}))}
        </div>
    )

}

const Course = ({course}) => {
    return (
        <div>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

const Total = ({parts}) => {
    return(
        <p><strong>Total of {parts.reduce((a, b) => a + b.exercises, 0)} exercises</strong></p>
    )
}

export default Course