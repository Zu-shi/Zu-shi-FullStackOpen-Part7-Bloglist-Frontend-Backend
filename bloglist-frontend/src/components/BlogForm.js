import { useState } from 'react'

const BlogForm = (props) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  return (
    <form onSubmit={(event) => props.onSubmitBlog(event, blogTitle, author, url)}>
      Blog Title: <input type="text" placeholder='write blog content here' onChange={event => setBlogTitle(event.target.value)}></input>
      Author: <input type="text" onChange={event => setAuthor(event.target.value)}></input>
      Url: <input type="text" onChange={event => setUrl(event.target.value)}></input>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm