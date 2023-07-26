import Toggleable from './Toggleable'
import { useQuery } from 'react-query'
import { getCommentsByMultiId } from '../services/comments'
import { useContext } from 'react'
import { CommentForm } from './CommentForm'
import React from 'react'

/*
const LikeButton = ({ blog }) => {
  return (
    <button onClick={LikeArticle}></button>
  );
}
*/

export const BlogContext = React.createContext()

const BlogElement = ({ user, blog, onLikeArticle, onDeleteArticle }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }


  let isUser = user && blog.user === user.id


  // console.log('---')
  // console.log(blog)
  // console.log(user)
  // console.log(blog.user === user)

  const renderDeleteButton = () => {
    if (isUser) {
      return (
        <button
          onClick={(event) => {
            onDeleteArticle(event, blog)
          }}
        >
          Delete
        </button>
      )
    } else {
      return
    }
  }

  const { data: comments, error, isLoading } =
    useQuery(['comments', blog.comments], getCommentsByMultiId)

  const commentDomItems = error || isLoading ? <div>Comments loading</div> :
    comments.map(
      (c) => {
        return <li key={c.id}>{c.content}</li>
      }
    )

  return (
    <div style={blogStyle}>
      {blog.title}
      <div>
        likes: {blog.likes}
        <button
          onClick={(event) => {
            onLikeArticle(event, blog)
          }}
        >
          Like This
        </button>
      </div>
      <Toggleable showButtonText="show details" hideButtonText="hide details">
        <div>author: {blog.author}</div>
      </Toggleable>
      {renderDeleteButton()}
      <ul>
        {commentDomItems}
      </ul>
      <BlogContext.Provider value={blog}>
        <CommentForm></CommentForm>
      </BlogContext.Provider>
    </div>
  )
}

export default BlogElement
