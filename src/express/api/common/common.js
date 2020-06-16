"use strict";

const dayjs = require(`dayjs`);

module.exports = {
  getCurrentDate() {
    return dayjs().format(`D.MM.YYYY`);
  },
};
