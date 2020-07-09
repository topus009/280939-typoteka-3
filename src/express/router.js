'use strict';

const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const authRouter = require(`./routes/auth`);
const articlesRouter = require(`./routes/articles`);

module.exports = {
  "/": mainRouter,
  "/auth": authRouter,
  "/my": myRouter,
  "/articles": articlesRouter,
};
