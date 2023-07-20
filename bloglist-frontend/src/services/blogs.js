import axios from 'axios'
const baseUrl = '/api/blogs'

const getAllByLikesOrder = () => {
  const request = axios.get(baseUrl)
  return request.then(response => {
    console.log('getAllByLikesOrder')
    console.log(response)
    return response.data.sort((a, b) => b.likes - a.likes)
  })
}

const postBlog = async ({ user, blogTitle, author, url }) => {
  const token = `bearer ${user.token}`
  console.log(token)

  const config = {
    headers: { Authorization: token },
  }

  const content = {
    'title': blogTitle,
    'author': author,
    'url': url
  }

  const response = await axios.post(baseUrl, content, config)
  console.log(response)
  return response
}

const likeBlog = async ({ user, blog }) => {
  const token = `bearer ${user.token}`
  console.log(token)

  const config = {
    headers: { Authorization: token },
  }

  const content = JSON.parse(JSON.stringify(blog))
  content.likes = blog.likes + 1

  console.log(content)

  const response = await axios.put(baseUrl + '/' + blog.id, content, config)
  return response
}


const deleteBlog = async ({ user, blog }) => {
  const token = `bearer ${user.token}`
  console.log(token)

  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(baseUrl + '/' + blog.id, config)
  console.log(response)
  return response
}

export default { getAllByLikesOrder, postBlog, likeBlog, deleteBlog }