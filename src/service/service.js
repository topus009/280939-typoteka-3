'use strict';

const {exit} = require(`../utils/utils`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
} = require(`../../config/constants`);
const {cli} = require(`./cli`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 && !cli[userCommand] && !process.env.COMMAND) {
  cli[DEFAULT_COMMAND].run();
  exit(`SUCCESS`);
} else if (process.env.COMMAND && cli[process.env.COMMAND]) {
  cli[process.env.COMMAND].run(userArguments.slice(1));
} else {
  cli[userCommand].run(userArguments.slice(1));
}
