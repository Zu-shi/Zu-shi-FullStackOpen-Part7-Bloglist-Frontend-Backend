import { useQuery } from 'react-query'
// import { QueryClient, QueryClientProvider } from 'react-query'
import Blog from './Blog'
import blogService from '../services/blogs'

export const BlogList = () => {
  const { blogs, error, isLoading } = useQuery('blogs', async () => {
    const response = await blogService.getAllByQuery()
    return response.data
  })

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