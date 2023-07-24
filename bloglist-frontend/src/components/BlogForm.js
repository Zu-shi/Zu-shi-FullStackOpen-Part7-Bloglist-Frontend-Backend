import { useState } from 'react'
import blogService from '../services/blogs'
import { useContext } from 'react'
import { UserContext } from './UserContext'
import { NotificationContext } from './NotificationContext'
import { qc } from '../qcp'
import { useMutation } from 'react-query'

import axios from 'axios'
const baseUrl = '/api/blogs'

const BlogForm = () => {
  const [blogTitle, setBlogTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const user = useContext(UserContext)

  const test = newNote => axios.post(baseUrl, newNote).then(res => res.data)

  const setErrorMesssage = useContext(NotificationContext)

  const postBlog = useMutation(
    //test,
    blogService.postBlogByQuery,
    {
      onSuccess: (res) => {
        const data = qc.getQueryData('blogs');
        console.log(data)
        data.push(res)
        console.log('---')
        console.log(data)
        // Note to self: do not post
        qc.setQueryData('blogs', data)
        setBlogTitle(prevBlogTitle => '')
        setAuthor('')
        setUrl('')
        setErrorMesssage('New article posted!')
        setTimeout(() => {
          setErrorMesssage(null)
        }, 5000)
      },
      onError: (error) => {
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
      }
    })

  const onSubmitBlog = function (event, title, author, url) {
    event.preventDefault()
    event.target.reset()
    //console.log("submitting with ", this.username, this.password)
    // eslint-disable-next-line no-unused-vars
    const blog = { title, author, url }
    postBlog.mutate({ user, blog })
  }

  return (
    <form
      onSubmit={(event) => onSubmitBlog(event, blogTitle, author, url)}
    >
      Blog Title:{' '}
      <input
        type="text"
        placeholder="write blog content here"
        onChange={(event) => setBlogTitle(event.target.value)}
      ></input>
      Author:{' '}
      <input
        type="text"
        onChange={(event) => setAuthor(event.target.value)}
      ></input>
      Url:{' '}
      <input
        type="text"
        onChange={(event) => setUrl(event.target.value)}
      ></input>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm
