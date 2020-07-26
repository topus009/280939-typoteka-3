"use strict";

const {readFileAsync} = require(`../../utils/utils`);
const {MockFilesPaths} = require(`../../../config/constants`);

const init = async (store) => {
  for (let key in store) {
    if (store.hasOwnProperty(key)) {
      const path = MockFilesPaths[key.toUpperCase()];
      const [data] = await readFileAsync(path);
      store[key] = JSON.parse(data);
    }
  }
};

module.exports = async () => {
  const store = {
    users: null,
    categories: null,
    articles: null,
    comments: null,
  };

  await init(store);
  return store;
};
