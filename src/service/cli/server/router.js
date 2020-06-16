'use strict';

const usersRouter = require(`./routes/users`);
const categoriesRouter = require(`./routes/categories`);
const postsRouter = require(`./routes/posts`);
const commentsRouter = require(`./routes/comments`);
const errorsRouter = require(`./routes/error`);

module.exports = {
  "/users": usersRouter,
  "/categories": categoriesRouter,
  "/posts": postsRouter,
  "/comments": commentsRouter,
  "*": errorsRouter,
};
