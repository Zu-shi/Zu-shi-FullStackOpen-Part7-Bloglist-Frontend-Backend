//import { parse, stringify, toJSON, fromJSON } from 'flatted';
import { useState, useEffect } from 'react'
// import { useQuery } from 'react-query'
// import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Toggleable from './components/Toggleable'
import { BlogList } from './components/BlogList'
import { UserContext } from './components/UserContext'
import { NotificationContext } from './components/NotificationContext'

const App = () => {
  const [, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMesssage] = useState(null)
  // const queryClient = new QueryClient()

  // const { blogs, error, isLoading } = useQuery('blogs', async () => {
  //   const response = await blogService.getAllByQuery()
  //   return response.data
  // })

  // const { data, error, isLoading } = useQuery('blogs', blogService.getAllByQuery)
  /*
  useQuery('blogs', async () => {
    const response = await blogService.getAllByQuery()
    return response.data
  })
  */

  useEffect(() => {
    console.log('test')
    setUser(JSON.parse(loginService.getCurrentUser()))
  }, [])

  // const onLikeArticle = (event, blog) => {
  //   event.preventDefault()
  //   console.log('submitting like with ', user, blog)
  //   //console.log("submitting with ", this.username, this.password)

  //   blogService
  //     .likeBlog({ user, blog })
  //     .then((response) => {
  //       // don't need to check response status, error go directly below.
  //       console.log('succeeded like')
  //       console.log(response.data)
  //       blogService.getAllByLikesOrder().then((blogs) => setBlogs(blogs))
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //       setErrorMesssage('Wrong credentials')
  //       setTimeout(() => {
  //         setErrorMesssage(null)
  //       }, 5000)
  //     })
  // }

  // const onDeleteArticle = (event, blog) => {
  //   event.preventDefault()
  //   console.log('submitting delete with ', user, blog)
  //   //console.log("submitting with ", this.username, this.password)

  //   blogService
  //     .deleteBlog({ user, blog })
  //     .then((response) => {
  //       // don't need to check response status, error go directly below.
  //       console.log('succeeded like')
  //       console.log(response.data)
  //       blogService.getAllByLikesOrder().then((blogs) => setBlogs(blogs))
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //       setErrorMesssage('Wrong credentials')
  //       setTimeout(() => {
  //         setErrorMesssage(null)
  //       }, 5000)
  //     })
  // }

  const onSubmitLogin = function (event, username, password) {
    event.preventDefault()
    console.log('submitting with ', username, password)
    //console.log("submitting with ", this.username, this.password)

    loginService
      .login({ username, password })
      .then((response) => {
        // don't need to check response status, error go directly below.
        console.log('succeeded login')
        console.log(response.data)
        setUser(response.data)
        loginService.setCurrentUser(JSON.stringify(response.data))
      })
      .catch((error) => {
        console.log(error)
        setErrorMesssage('Wrong credentials')
        setTimeout(() => {
          setErrorMesssage(null)
        }, 5000)
      })
  }

  const onSubmitLogout = function () {
    loginService.logout()
    setUser(null)
    setBlogs([])
  }

  useEffect(() => {
    blogService.getAllByLikesOrder().then((blogs) => setBlogs(blogs))
  }, [])

  // console.log(data)
  return (
    // <QueryClientProvider client={queryClient}>
    <div>
      <NotificationContext.Provider value={setErrorMesssage}>
        <UserContext.Provider value={user}>
          <Notification message={errorMessage} />

          {user ? (
            <div>
              {user.username} is logged in <> </>
              <button onClick={onSubmitLogout}>Logout</button>
              <Toggleable
                showButtonText={'Show Blog Submit Form'}
                hideButtonText={'Hide Blog Submit Form'}
                buttonName={'blogSubmitFormButton'}
              >
                <BlogForm />
              </Toggleable>
            </div>
          ) : (
            <LoginForm onSubmitLogin={onSubmitLogin} />
          )}

          <h2>blogs</h2>
          <BlogList />
        </UserContext.Provider>
      </NotificationContext.Provider>
    </div>
    // </QueryClientProvider>
  )
}

export default App
