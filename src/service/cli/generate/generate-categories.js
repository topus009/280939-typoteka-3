'use strict';

const {writeToFileAsync} = require(`../../../utils/utils`);
const {getSamples} = require(`./utils`);

const generateData = async () => {
  const samples = await getSamples();
  const data = samples.categories.map((category, id) => ({
    id: id + 1,
    label: category,
  }));
  return data;
};

const generateCategories = async (fileName) => {
  const data = await generateData();
  await writeToFileAsync(``, fileName, JSON.stringify(data));
  return data;
};

module.exports = generateCategories;
