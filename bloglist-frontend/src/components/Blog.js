import Toggleable from './Toggleable'

/*
const LikeButton = ({ blog }) => {
  return (
    <button onClick={LikeArticle}></button>
  );
}
*/

const Blog = ({ user, blog, onLikeArticle, onDeleteArticle }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  let isUser = blog.user === user
  console.log('---')
  console.log(blog)
  console.log(user)
  console.log(blog.user === user)

  const renderDeleteButton = () => {
    if (isUser) {
      return <button onClick={(event) => { onDeleteArticle(event, blog) }}>Delete</button>
    } else {
      return
    }
  }

  return (
    < div style={blogStyle}>
      {blog.title}
      <div>
        likes: {blog.likes}
        <button onClick={(event) => { onLikeArticle(event, blog) }}>Like This</button>
      </div>
      <Toggleable showButtonText="show details" hideButtonText="hide details">
        <div>
          author: {blog.author}
        </div>
      </Toggleable>
      {renderDeleteButton()}
    </div>)
}

export default Blog