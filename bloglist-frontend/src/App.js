//import { parse, stringify, toJSON, fromJSON } from 'flatted';
import { useState, useEffect } from 'react'
// import { useQuery } from 'react-query'
import BlogElement from './components/BlogElement'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Toggleable from './components/Toggleable'
import { BlogList } from './components/BlogList'
import { UserContext } from './components/UserContext'
import { NotificationContext } from './components/NotificationContext'
import { BrowserRouter as Router, Routes, Route, Link, useMatch, useParams, useNavigate } from 'react-router-dom'
import { getUsersByQuery, getSingleUserByQuery } from './services/users'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { Container, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Paper } from '@mui/material'

const App = () => {
  const [, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMesssage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('test')
    setUser(JSON.parse(loginService.getCurrentUser()))
  }, [])

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

  const padding = {
    padding: 5
  }

  console.log(user)
  const Blogs = () => {
    return (
      <div>
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
      </div >
    )
  }

  const { data: users, error, isLoading } = useQuery('users', getUsersByQuery)

  const match = useMatch('/users/:username')
  if (!users) return null
  const userLink = match ? users.find(user => user.username === match.params.username) : null

  const Users = () => {

    /*
    const usersElem = []
    if (!error && !isLoading) {
      usersElem = users.map(user => { (<text key={user.username}>{user.username}</text>) })
    }
    */

    return (
      <div>
        {error || isLoading ? 'User is loading' :

          <TableContainer component={Paper}>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="left">Blog Articles Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell><Link to={`/users/${user.username}`}>{user.username}</Link></TableCell>
                    <TableCell>{user.blogs.length}</TableCell>
                  </TableRow>))
                }
              </TableBody>
            </Table>
          </TableContainer>
        }
      </div >
    )
  }

  const User = () => {
    const username = useParams().username
    // console.log('UserLink logging')
    // console.log(userLink)
    const { data: user, error, isLoading } =
      useQuery([`users/${username}`, username], getSingleUserByQuery)

    return (
      <div>
        {error || isLoading ? 'List of users is loading' :

          <TableContainer component={Paper}>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>Blog Title</TableCell>
                  <TableCell>Blog Author</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user.blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    {/* <TableCell>{blog.title}</TableCell> */}
                    <TableCell><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></TableCell>
                    <TableCell>{blog.author}</TableCell>
                  </TableRow>))
                }
              </TableBody>
            </Table>
          </TableContainer>
        }
      </div >
    )
  }

  const Blog = () => {
    const blogId = useParams().blogId
    const user = useContext(UserContext)

    const { data: blog, error, isLoading } =
      useQuery([`blogs/${blogId}`, blogId], blogService.getSingleBlogByQuery)

    const onLikeArticle = (event, blog) => {
      event.preventDefault()
      console.log('submitting like with ', user, blog)
      //console.log("submitting with ", this.username, this.password)

      blogService
        .likeBlog({ user, blog })
        .then((response) => {
          // don't need to check response status, error go directly below.
          console.log('succeeded like')
          console.log(response.data)
          setErrorMesssage(`Liked post '${blog.title}'`)
          setTimeout(() => {
            setErrorMesssage(null)
          }, 5000)
        })
        .catch((error) => {
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

      blogService
        .deleteBlog({ user, blog })
        .then((response) => {
          // don't need to check response status, error go directly below.
          console.log('succeeded like')
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error)
          setErrorMesssage('Wrong credentials')
          setTimeout(() => {
            setErrorMesssage(null)
          }, 5000)
        })
    }

    return (
      <div>
        {error || isLoading ? 'Blog is loading' :
          <BlogElement
            key={blog.id}
            blog={blog}
            onLikeArticle={onLikeArticle}
            onDeleteArticle={onDeleteArticle}
            user={user}
          />
        }
      </div>
    )
  }

  // console.log(data)
  return (
    // <QueryClientProvider client={queryClient}>
    <Container>
      <NotificationContext.Provider value={setErrorMesssage}>
        <UserContext.Provider value={user}>
          <Notification message={errorMessage} />

          <Link style={padding} to="/">Home</Link>
          <Link style={padding} to="/blogs">Blogs</Link>
          <Link style={padding} to="/users">Users</Link>
          <Routes>
            <Route path="/" element={<Blogs />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:blogId" element={<Blog />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:username" element={<User user={userLink} />} />
          </Routes>

        </UserContext.Provider>
      </NotificationContext.Provider>
    </Container>
    // </QueryClientProvider>
  )
}

export default App
