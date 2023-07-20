//import { parse, stringify, toJSON, fromJSON } from 'flatted';
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Toggleable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMesssage] = useState(null)

  useEffect(() => {
    console.log('test')
    setUser(JSON.parse(loginService.getCurrentUser()))
  }, [])

  const onLikeArticle = (event, blog) => {
    event.preventDefault()
    console.log('submitting like with ', user, blog)
    //console.log("submitting with ", this.username, this.password)

    blogService.likeBlog({ user, blog }).then((response) => {
      // don't need to check response status, error go directly below.
      console.log('succeeded like')
      console.log(response.data)
      blogService.getAllByLikesOrder().then(blogs =>
        setBlogs(blogs)
      )
    }).catch(error => {
      console.log(error)
      setErrorMesssage('Wrong credentials')
      setTimeout(() => {
        setErrorMesssage(null)
      }, 5000)
    })
  }


  const onDeleteArticle = (event, blog) => {
    event.preventDefault()
    console.log('submitting delete with ', user, blog)
    //console.log("submitting with ", this.username, this.password)

    blogService.deleteBlog({ user, blog }).then((response) => {
      // don't need to check response status, error go directly below.
      console.log('succeeded like')
      console.log(response.data)
      blogService.getAllByLikesOrder().then(blogs =>
        setBlogs(blogs)
      )
    }).catch(error => {
      console.log(error)
      setErrorMesssage('Wrong credentials')
      setTimeout(() => {
        setErrorMesssage(null)
      }, 5000)
    })
  }

  const onSubmitLogin = function (event, username, password) {
    event.preventDefault()
    console.log('submitting with ', username, password)
    //console.log("submitting with ", this.username, this.password)

    loginService.login({ username, password }).then((response) => {
      // don't need to check response status, error go directly below.
      console.log('succeeded login')
      console.log(response.data)
      setUser(response.data)
      loginService.setCurrentUser(JSON.stringify(response.data))
    }).catch(error => {
      console.log(error)
      setErrorMesssage('Wrong credentials')
      setTimeout(() => {
        setErrorMesssage(null)
      }, 5000)
    })
  }

  const onSubmitBlog = function (event, blogTitle, author, url) {
    event.preventDefault()
    //console.log("submitting with ", this.username, this.password)

    blogService.postBlog({ user, blogTitle, author, url }).then(() => {
      // don't need to check response status, error go directly below.
      // To optimize later, does not need to make a roundtrip to server.
      blogService.getAllByLikesOrder().then(blogs =>
        setBlogs(blogs)
      )
    }).catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
      setErrorMesssage('Posting blog article failed')
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
    blogService.getAllByLikesOrder().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  return (
    <div>
      <Notification message={errorMessage} />

      {user ?
        <div>
          {user.username} is logged in <> </>
          <button onClick={onSubmitLogout}>Logout</button>
          <Toggleable showButtonText={'Show Blog Submit Form'} hideButtonText={'Hide Blog Submit Form'} buttonName={'blogSubmitFormButton'}>
            <BlogForm onSubmitBlog={onSubmitBlog} />
          </Toggleable>
        </div> :
        <LoginForm onSubmitLogin={onSubmitLogin} />
      }

      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} onLikeArticle={onLikeArticle} onDeleteArticle={onDeleteArticle} user={user.id} />
      )}
    </div>
  )
}

export default App