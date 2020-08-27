'use strict';

const ch = require(`chalk`);
const {AppCommands} = require(`../../../config/constants`);

const messages = [
  [
    ch.green(`service.js`),
    ` <${ch.yellow(`command`)}>`,
    ``,
  ],
  [],
  [
    ch.green(AppCommands.VERSION),
    `            `,
    `displays the version number`,
  ],
  [
    ch.green(AppCommands.HELP),
    `               `,
    `prints this text`,
  ],
  [
    ch.green(AppCommands.GENERATE),
    ` <${ch.yellow(`count`)}>   `,
    `creates files ${ch.yellow(`.json`)} in ${ch.yellow(`mocks `)} folder`,
  ],
  [
    ch.green(AppCommands.SERVER),
    `   <${ch.yellow(`port`)}>    `,
    `start http-server on the specified port`,
  ],
];

module.exports = {
  name: AppCommands.HELP,
  run() {
    messages.forEach((msg) => {
      const [command = ``, param = ``, description = ``] = msg;
      console.log(command, param, description);
    });
  },
};
