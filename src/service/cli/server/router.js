'use strict';

const usersRouter = require(`./routes/common/users`);
const categoriesRouter = require(`./routes/common/categories`);
const articlesRouter = require(`./routes/common/articles`);
const commentsRouter = require(`./routes/common/comments`);

const mainPageRouter = require(`./routes/pages/main`);
const myPageRouter = require(`./routes/pages/my`);
const articlesPageRouter = require(`./routes/pages/articles`);

const routes = {
  // common
  "users": usersRouter,
  "categories": categoriesRouter,
  "articles": articlesRouter,
  "comments": commentsRouter,
  // pages
  "pages/main": mainPageRouter,
  "pages/my": myPageRouter,
  "pages/articles": articlesPageRouter,
};

module.exports = routes;
