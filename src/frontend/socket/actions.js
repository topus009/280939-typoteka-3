'use strict';

const axios = require(`../axios`);
const {
  lastTemplate,
  hotTemplate,
} = require(`./templates-compiler`);

const sendLastAndHotTemplatesBySocket = async (req, commentRes, userId) => {
  const io = req.app.get(`io`);

  const [
    userData,
    hotData,
  ] = await Promise.all([
    axios.get(`/users/${userId}`),
    axios.get(`/articles/articles/hot`),
  ]);

  const lastHTML = lastTemplate({
    comment: commentRes.data,
    user: userData.data,
    preRendered: true,
  });
  const hotHTML = hotTemplate({mostPopularArticles: hotData.data});

  io.emit(`NEW_COMMENT`, {
    lastHTML,
    hotHTML,
  });
};

module.exports = {
  sendLastAndHotTemplatesBySocket,
};
