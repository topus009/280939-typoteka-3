'use strict';

const ch = require(`chalk`);

const message = `
The program starts ${ch.cyan(`http-server`)} and generates a data file for the API.

  Guide:
    ${ch.green(`service.js`)} <${ch.yellow(`command`)}>
    Commands:
    ${ch.green(`--version`)}:            displays the version number
    ${ch.green(`--help`)}:               prints this text
    ${ch.green(`--generate`)} <${ch.yellow(`count`)}>    creates files ${ch.yellow(`.json`)} in ${ch.yellow(`mocks `)} folder
    ${ch.green(`--server`)} <${ch.yellow(`port`)}>    start http-server on the specified port
`;

module.exports = {
  name: `--help`,
  run() {
    console.log(message);
  }
};
