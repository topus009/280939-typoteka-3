'use strict';

const {cli} = require(`./cli`);
const {exit} = require(`../utils/utils`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
} = require(`../config/constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !cli[userCommand]) {
  cli[DEFAULT_COMMAND].run();
  exit(`SUCCESS`);
}

cli[userCommand].run(userArguments.slice(1));
