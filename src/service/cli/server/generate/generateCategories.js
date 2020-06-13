'use strict';

const {nanoid} = require(`nanoid`);
const {writeToFileAsync} = require(`../../../../utils/utils`);
const {getSamples} = require(`./utils`);
const {PATH_TO_MOCKDATA} = require(`../../../../config/constants`);

const FILE_NAME = PATH_TO_MOCKDATA + `/categories.json`;

const generateData = async () => {
  const samples = await getSamples();

  const data = samples.categories.map((category) => ({
    id: nanoid(),
    label: category,
  }));

  return data;
};

const generateCategories = async () => {
  const content = await generateData();
  await writeToFileAsync(``, FILE_NAME, JSON.stringify(content));
};

module.exports = generateCategories;
