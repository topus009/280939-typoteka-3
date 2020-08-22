'use strict';

const NodeEnvironment = require(`jest-environment-node`);
const supertest = require(`supertest`);
const {createServer} = require(`../src/backend/server`);


class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();
    const server = await createServer();
    const request = supertest(server);
    this.global.request = request;
  }
}

module.exports = CustomEnvironment;
