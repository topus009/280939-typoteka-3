"use strict";

const axiosInstance = require(`axios`);

const axios = axiosInstance.create();

axios.defaults.baseURL = `http://localhost:3000`;

module.exports = axios;
