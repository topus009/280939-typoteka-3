'use strict';

const usersRouter = require(`./routes/common/users`);
const categoriesRouter = require(`./routes/common/categories`);
const postsRouter = require(`./routes/common/posts`);
const commentsRouter = require(`./routes/common/comments`);
const errorsRouter = require(`./routes/common/errors`);

const mainPageRouter = require(`./routes/pages/main`);
const myPageRouter = require(`./routes/pages/my`);
const postsPageRouter = require(`./routes/pages/posts`);

const routes = {
  // common
  "common/users": usersRouter,
  "common/categories": categoriesRouter,
  "common/posts": postsRouter,
  "common/comments": commentsRouter,
  // pages
  "pages/main": mainPageRouter,
  "pages/my": myPageRouter,
  "pages/posts": postsPageRouter,
  // errors
  "*": errorsRouter,
};

module.exports = routes;
