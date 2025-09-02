 const LoginForm = ({handleLogin, usernameChange, passwordChange, username, password}) => {
    return (
<div>
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
        <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={usernameChange}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={passwordChange}
        />
        </div>
      <button type="submit">login</button>
    </form>   
    </div>   
  )
 }


export default LoginForm