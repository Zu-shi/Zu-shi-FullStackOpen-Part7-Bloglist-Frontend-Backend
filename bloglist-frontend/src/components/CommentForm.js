import { useState } from 'react'
import { postComment } from '../services/comments'
import { useContext } from 'react'
import { NotificationContext } from './NotificationContext'
import { qc } from '../qcp'
import { useMutation } from 'react-query'
import { BlogContext } from './BlogElement'

export const CommentForm = () => {
  const setErrorMesssage = useContext(NotificationContext)
  const blog = useContext(BlogContext)
  const [content, setContent] = useState('')

  const postBlog = useMutation(
    // test,
    postComment,
    {
      onSuccess: (res) => {
        const data = qc.getQueryData(['comments', blog.comments]);
        console.log('onsuccess query data', data)
        console.log('res', res)
        blog.comments.concat(res)
        qc.setQueryData(['comments', blog.comments], data.concat(res))
        const data2 = qc.getQueryData(['comments', blog.comments]);
        console.log('data2', data2)
        setContent(prevContent => '')
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
    }
  )

  const submitComment = (event, content) => {
    event.preventDefault()
    console.log('content', content)
    postBlog.mutate({ blog, content })
  }

  return (
    <form onSubmit={(event) => submitComment(event, content)}>
      Comment:<input type="text" value={content} onChange={(event) => setContent(event.target.value)}></input>
      <button type="submit">Submit</button>
    </form>
  )
}