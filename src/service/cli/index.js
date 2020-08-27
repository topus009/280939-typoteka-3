'use strict';

const server = require(`../../backend/server`);
const help = require(`./help`);
const generate = require(`./generate/generate`);
const version = require(`./version`);

const cli = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
};

module.exports = {
  cli,
};
