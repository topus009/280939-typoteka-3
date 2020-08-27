"use strict";

const axiosInstance = require(`axios`);
const {
  BASE_URL,
  LoggerNames,
} = require(`../../config/constants`);
const {createLogger} = require(`../utils/logger`);

const logApi = createLogger(LoggerNames.FRONTEND_API);

const axios = axiosInstance.create();

axios.defaults.baseURL = BASE_URL;

axios.interceptors.response.use(
  (response) => {
    const {status, config} = response;
    const {url, method} = config;
    logApi.debug(`${method.toUpperCase()} ${url} - statusCode - ${status}`);
    return response;
  },
  (error) => Promise.reject(error.response.data),
);

module.exports = axios;
