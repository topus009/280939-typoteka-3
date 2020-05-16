'use strict';

const routes = require(`./routes`);

module.exports = (req, res) => {
  if (routes[req.url]) {
    routes[req.url](res);
  } else {
    routes.default(res);
  }
};
