"use strict";

const axiosInstance = require(`axios`);
const {BACKEND_API_PREFIX} = require(`../config/constants`);

const axios = axiosInstance.create();

const BASE_URL = `${process.env.BACKEND_API_HOST}:${process.env.BACKEND_API_PORT}${BACKEND_API_PREFIX}`;

axios.defaults.baseURL = BASE_URL;

module.exports = axios;
