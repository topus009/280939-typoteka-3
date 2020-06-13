'use strict';

const errorsRouter = require(`./routes/error`);

module.exports = {
  "*": errorsRouter,
};
