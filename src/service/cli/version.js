'use strict';
const ch = require(`chalk`);

module.exports = {
  name: `--version`,
  run() {
    console.log(ch.cyan(process.version));
  }
};
