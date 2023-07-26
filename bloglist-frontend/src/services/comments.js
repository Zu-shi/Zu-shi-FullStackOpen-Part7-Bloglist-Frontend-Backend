import axios from 'axios';
const baseUrl = '/api/comments'

export const getAllComments = async () => {
  const result = await axios.get(baseUrl)
  return result.data
}

export const getCommentsById = async ({ queryKey }) => {
  const [, commentId] = queryKey
  const result = await axios.get(`${baseUrl}/${commentId}`)
  return result.data
}

export const getCommentsByMultiId = async ({ queryKey }) => {
  const [, commentIds] = queryKey
  const commentChain = commentIds.join('&')
  const result = await axios.get(`${baseUrl}/${commentChain}`)
  return result.data
}

export const getCommentsByBlog = async ({ queryKey }) => {
  const [, blogId] = queryKey
  const result = await axios.get(`${baseUrl}/blog/${blogId}`)
  return result.data
}

export const postComment = async ({ blog, content }) => {
  console.log('blog', blog)
  console.log('content', content)
  const req = {
    blogId: blog.id,
    content: content
  }

  return axios.post(`${baseUrl}`, req).then(
    (res) => {
      console.log(res.data)
      return res.data
    }
  )
}