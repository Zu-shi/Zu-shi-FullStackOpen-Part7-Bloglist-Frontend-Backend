const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
const logger = require('../utils/logger');
const errorENUM = require('../utils/errorENUM');

loginRouter.post('/', async (request, response, next) => {
  const { body } = request;

  const user = await User.findOne({ username: body.username });
  const passwordCorret =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorret)) {
    logger.info('Login failed');
    next(errorENUM.ERR07);
    return;
  }

  const { username, _id, name } = user;

  const userForToken = {
    username,
    id: _id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  logger.info('Login succeeded');
  response.status(200).send({ token, username, name, id: _id });
});

module.exports = loginRouter;
