'use strict';

const {HTTP_CODES} = require(`../../../config/constants`);
const {writeHead, readFileAsync} = require(`../../../utils/utils`);

const {
  HTTP_SUCCESS_CODE,
  HTTP_NOT_FOUND_CODE,
} = HTTP_CODES;

const getDefautRoute = (res, message) => {
  writeHead(res, HTTP_NOT_FOUND_CODE, `text/plain`);
  res.end(message || `Не повезло, :(`);
};

const getBaseRoute = async (res) => {
  const filePath = `${process.cwd()}/mocks.json`;
  let data;
  try {
    data = await readFileAsync(filePath, true);
  } catch (err) {
    if (err) {
      getDefautRoute(res);
    }
  }

  const jsonData = JSON.parse(data);
  if (jsonData.length) {
    const template = [];
    template.push(`<ul>\n`);
    for (const item of jsonData) {
      template.push(`<li>${item.title}</li>\n`);
    }
    template.push(`</ul>`);
    writeHead(res, HTTP_SUCCESS_CODE);
    res.end(template.join(``));
  } else {
    getDefautRoute(res, `Not found`);
  }
};

module.exports = {
  '/': getBaseRoute,
  "default": getDefautRoute,
};
