import { useQuery, setQueryData } from 'react-query'
// import { QueryClient, QueryClientProvider } from 'react-query'
import Blog from './Blog'
import blogService from '../services/blogs'
import { useContext } from 'react'
import { UserContext } from './UserContext'
import { NotificationContext } from './NotificationContext'
import { qc } from '../qcp'

export const BlogList = () => {
  // const [user, setUser] = useState(null)
  const user = useContext(UserContext)
  const setErrorMesssage = useContext(NotificationContext)

  const { data: blogs, error, isLoading } = useQuery('blogs', blogService.getAllByQuery)

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
        // queryClient.
        const d = blogs.filter((item) => (item.id !== blog.id))
        qc.setQueryData('blogs', d.sort((a, b) => b.likes - a.likes));
        //qc.setQueryData('blogs', () => { return [] });

        // blogService.getAllByLikesOrder().then((blogs) => setBlogs(blogs))

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
        setQueryData('blogs', blogs.filter((item) => (item.id !== blog.id)));
        // blogService.getAllByLikesOrder().then((blogs) => setBlogs(blogs))
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
      {isLoading || error ? ('Loading or Error') :
        (
          blogs.map(
            (blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                onLikeArticle={onLikeArticle}
                onDeleteArticle={onDeleteArticle}
                user={user.id}
              />
            )
          )
        )
      }
    </div>
  )
}