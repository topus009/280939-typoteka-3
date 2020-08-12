'use strict';

const session = require(`express-session`);
const {Sequelize} = require(`sequelize`);
const connectSessionSequelize = require(`connect-session-sequelize`);

const SequelizeStore = connectSessionSequelize(session.Store);

let database = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
      host: process.env.PG_HOST,
      dialect: process.env.PG_DIALECT,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      logging: false,
    }
);

const store = new SequelizeStore({
  db: database,
  checkExpirationInterval: 100 * 15 * 60 * 1000,
  expiration: 10 * 24 * 60 * 60 * 60 * 1000
});

const userSessions = session({
  secret: process.env.SESSION_SECRET,
  store,
  resave: false,
  proxy: true,
  saveUninitialized: false,
  cookie: {maxAge: 10 * 86400},
  name: `sid`
});

module.exports = {
  store,
  userSessions,
};
