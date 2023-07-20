const app = require('../app');
const User = require('../models/user.js');
const Blog = require('../models/blog.js');
const resetRouter = require('express').Router();

resetRouter.post('/reset', async (request, response, next) => {
  console.log('resetting');
  await User.deleteMany({});
  await Blog.deleteMany({});
  console.log('done');
  return response.status(204).end();
});

module.exports = resetRouter;
