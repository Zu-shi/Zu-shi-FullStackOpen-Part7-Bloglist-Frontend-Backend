import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response
}

const logout = () => window.localStorage.removeItem('bloglistAppUser')

const getCurrentUser = () => window.localStorage.getItem('bloglistAppUser') ? JSON.parse(window.localStorage.getItem('bloglistAppUser')) : null
const setCurrentUser = (user) => window.localStorage.setItem('bloglistAppUser', JSON.stringify(user))

const exportObject = { login, logout, setCurrentUser, getCurrentUser }

export default exportObject