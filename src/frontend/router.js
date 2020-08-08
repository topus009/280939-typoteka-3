'use strict';

const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const {
  registerRouter,
  loginRouter,
} = require(`./routes/auth`);
const articlesRouter = require(`./routes/articles`);

module.exports = {
  "/": mainRouter,
  "/register": registerRouter,
  "/login": loginRouter,
  "/my": myRouter,
  "/articles": articlesRouter,
};
