'use strict';

const {Sequelize} = require(`sequelize`);
const session = require(`express-session`);
const connectSessionSequelize = require(`connect-session-sequelize`);
const {
  SESSION_EXPIRATION,
  SESSION_EXPIRATION_INTERVAL,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
  databaseOptions,
} = require(`../../config/constants`);

const SessionStore = connectSessionSequelize(session.Store);

const database = new Sequelize(...databaseOptions);

const store = new SessionStore({
  db: database,
  expiration: SESSION_EXPIRATION,
  checkExpirationInterval: SESSION_EXPIRATION_INTERVAL,
});

const userSessionsMiddleware = session({
  secret: process.env.SESSION_SECRET,
  store,
  resave: false,
  proxy: true,
  saveUninitialized: false,
  cookie: {maxAge: SESSION_COOKIE_MAX_AGE},
  name: SESSION_COOKIE_NAME,
});

module.exports = {
  store,
  userSessionsMiddleware,
};
