'use strict';

const chalk = require(`chalk`);

module.exports = {
  log: (message) => console.log(chalk.cyan(message)),
  success: (message) => console.log(chalk.green(message)),
  error: (message) => console.error(message),
};
