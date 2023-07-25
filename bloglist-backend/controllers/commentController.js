const mongoose = require('mongoose')
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const logger = require('../utils/logger');
const commentRouter = require('express').Router();

// Get all comments
commentRouter.get('/', async (request, response) => {
  const comments = await Comment.find({});
  response.json(comments);
});

// Get some comment
commentRouter.get('/:ids', async (request, response) => {
  const commentIds = request.params.ids.split('&')
  const comments = await Comment.find({ '_id': { $in: commentIds } });
  response.status(200).json(comments);
});

// Create a comment
commentRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    logger.info(request)
    logger.info("BlogId")
    logger.info(body.blogId)

    const blog = await Blog.findById(body.blogId)

    const comment = new Comment({
      content: body.content,
      blog: Blog._id
    })

    const result = await comment.save();

    logger.info("Blog")
    logger.info(blog)
    logger.info("CommentId")
    logger.info(comment._id)

    if (!blog.version) {
      console.log("No version")
      await Blog.findByIdAndUpdate(body.blogId, {
        $set: {
          version: 1,
          comments: [mongoose.Types.ObjectId(result._id)]
        }
      }).then(updatedPost => { logger.info("updated"); logger.info(updatedPost) })
    }
    else {
      console.log("Has version")
      blog.comments = blog.comments.concat(result._id)
      await blog.save()
    }
    response.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = commentRouter;
