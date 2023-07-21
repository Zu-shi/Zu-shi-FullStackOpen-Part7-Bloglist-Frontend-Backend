import { useQuery } from 'react-query'
// import { QueryClient, QueryClientProvider } from 'react-query'
import Blog from './Blog'
import blogService from '../services/blogs'

export const BlogList = () => {
  // const [user, setUser] = useState(null)

  const { data: blogs, error, isLoading } = useQuery('blogs', blogService.getAllByQuery)

  return (
    <div>
      {isLoading || error ? ('Loading or Error') :
        (
          blogs.map(
            (blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                onLikeArticle={null}
                onDeleteArticle={null}
              // user={user.id}
              />
            )
          )
        )
      }
    </div>
  )
}