"use strict";

const path = require(`path`);
const dotenv = require(`dotenv`);

const NODE_ENV = process.env.NODE_ENV || `development`;

const filePath = path.join(process.cwd(), `config/envs/.env.${NODE_ENV}`);

dotenv.config({
  path: filePath
});
