'use strict';

const server = require(`../../backend/server`);
const help = require(`./help`);
const generate = require(`./generate/generate`);
const version = require(`./version`);

module.exports = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
};
