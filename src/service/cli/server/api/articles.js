"use strict";

const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);
const {
  DATE_FORMAT,
  HttpCodes,
} = require(`../../../../config/constants`);
const {CustomError} = require(`../../../../utils/utils`);
const {getHighlitedMatches} = require(`./utils`);

const articlesApi = (entityName, database) => ({
  delete(id) {
    const article = database[entityName].find((item) => item.id === +id);
    if (!article) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id}));
    }
    database[entityName] = database[entityName].filter((item) => item.id !== +id);
    database.comments = database.comments.filter((item) => item.articleId !== +id);
    return id;
  },

  add(data) {
    const id = nanoid();
    const createdDate = data.createdDate ? dayjs(data.createdDate).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT);

    const categories = !Array.isArray(data.categories) ? [data.categories] : data.categories;
    database[entityName].push({
      id,
      ...data,
      createdDate,
      categories,
    });
    return id;
  },

  edit(id, data) {
    let article;

    const targetArticle = database[entityName].find((item) => item.id === +id);
    if (!targetArticle) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id}));
    }

    database[entityName] = database[entityName].map((item) => {
      if (item.id === +id) {

        const categories = !Array.isArray(data.categories) ? [data.categories] : data.categories;

        article = {
          ...item,
          ...data,
          categories,
        };
        return article;
      } else {
        return item;
      }
    });
    return article;
  },

  getAll() {
    return database[entityName];
  },

  findById(id) {
    const articles = database[entityName];
    const article = articles.find((item) => item.id === +id);
    if (!article) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id}));
    }
    return {
      ...article,
      createdDate: dayjs(article.createdDate).format(`DD.MM.YYYY`)
    };
  },

  getArticlesByCategoryId(id) {
    const articles = database[entityName];
    const categories = database.categories;
    const category = categories.find((item) => item.id === +id);
    if (!category) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
    }
    return articles.filter((article) => article.categories.includes(+id));
  },

  searchByTitle(query) {
    const articles = database[entityName];
    const results = [];

    articles.forEach((article) => {
      const formattedMatch = getHighlitedMatches(query, article.title);
      if (formattedMatch) {
        results.push({
          ...article,
          title: formattedMatch
        });
      }
    });
    return results;
  },

  getHotArticles() {
    const MAX_HOT_COUNT = 4;

    const articles = database[entityName];
    const comments = database.comments;

    const getCommentsCount = (id, commentsData) => {
      const commentsCount = commentsData.filter((el) => el.articleId === id);
      if (commentsCount.length) {
        return commentsCount.length;
      }
      return 0;
    };
    const sortedArticlesByCommentsCount =
      articles
        .sort((a, b) => (getCommentsCount(b.id, comments)) - getCommentsCount(a.id, comments))
        .slice(0, MAX_HOT_COUNT);
    const articlesCount = sortedArticlesByCommentsCount.map((article) => {
      return [article.id, comments.filter((el) => el.articleId === article.id).length];
    });
    return articlesCount;
  },
});

module.exports = articlesApi;
