"use strict";

const path = require(`path`);
const dotenv = require(`dotenv`);

const filePath = path.join(process.cwd(), `setup/envs/.env.${process.env.NODE_ENV || `development`}`);

dotenv.config({
  path: filePath
});
