'use strict';

const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const authRouter = require(`./routes/auth`);
const postsRouter = require(`./routes/posts`);

module.exports = {
  "/": mainRouter,
  "/auth": authRouter,
  "/my": myRouter,
  "/posts": postsRouter,
};
