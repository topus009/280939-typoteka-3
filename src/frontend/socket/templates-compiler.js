'use strict';

const path = require(`path`);
const pug = require(`pug`);
const {EXPRESS_PATH_TO_TEMPLATES} = require(`../../../config/constants`);

const pathToCommentTemlates = path.join(EXPRESS_PATH_TO_TEMPLATES, `/common/prerendering`);
const pathToLast = `${pathToCommentTemlates}/last-comment.pug`;
const pathToHot = `${pathToCommentTemlates}/hottest-articles.pug`;

const lastTemplate = pug.compileFile(pathToLast);
const hotTemplate = pug.compileFile(pathToHot);

module.exports = {
  lastTemplate,
  hotTemplate,
};
