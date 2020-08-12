'use strict';

const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const {
  registerRouter,
  loginRouter,
  logoutRouter,
} = require(`./routes/auth`);
const articlesRouter = require(`./routes/articles`);

module.exports = {
  "/": mainRouter,
  "/register": registerRouter,
  "/login": loginRouter,
  "/logout": logoutRouter,
  "/my": myRouter,
  "/articles": articlesRouter,
};
