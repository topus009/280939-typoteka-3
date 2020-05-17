'use strict';

const MainRouter = require(`./routes/main`);
const MyRouter = require(`./routes/my`);
const ArticlesRouter = require(`./routes/articles`);
const SearchRouter = require(`./routes/search`);
const CategotiesRouter = require(`./routes/categoties`);

module.exports = {
  "/": MainRouter,
  "/my": MyRouter,
  "/articles": ArticlesRouter,
  "/search": SearchRouter,
  "/categories": CategotiesRouter,
};
