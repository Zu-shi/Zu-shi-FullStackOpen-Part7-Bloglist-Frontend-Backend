import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = (
  { onSubmitLogin }
) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div>
      <form onSubmit={event => onSubmitLogin(event, username, password)}>
        {/* <form onSubmit={onSubmitLogin}>*/}
        <div>
          Username: <input type="text" id="username" onChange={event => setUsername(event.target.value)} />
        </div>
        <div>
          Password: <input type="password" id="password" onChange={event => setPassword(event.target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div >
  )
}

export default LoginForm


LoginForm.propTypes = {
  onSubmitLogin: PropTypes.func.isRequired,
}