"use strict";

const axiosInstance = require(`axios`);
const {BACKEND_API_PREFIX} = require(`../config/constants`);
const {createLogger, LoggerNames} = require(`../utils/logger`);

const logApi = createLogger(LoggerNames.FRONTEND_API);

const axios = axiosInstance.create();

const BASE_URL = `${process.env.BACKEND_API_HOST}:${process.env.BACKEND_API_PORT}${BACKEND_API_PREFIX}`;

axios.defaults.baseURL = BASE_URL;

axios.interceptors.response.use(
    (response) => {
      const {status, config} = response;
      const {url, method} = config;
      logApi.debug(`${method.toUpperCase()} ${url} - statusCode - ${status}`);
      return response;
    },
    (error) => {
      const err = error.response.data;
      return Promise.reject(err);
    }
);

module.exports = axios;
