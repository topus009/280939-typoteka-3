'use strict';

const categories = require(`../../../../mocks/categories.json`);
const articles = require(`../../../../mocks/articles.json`);
const {HttpCodes} = require(`../../../../config/constants`);
const fm = require(`../../../utils/localization`);

const apiPrefix = `/api/articles`;

const articleShape = [`id`, `title`, `createdDate`, `announce`, `sentences`, `img`, `categories`];

describe(`Testing end-points (${apiPrefix}...)`, () => {
  test(`GET / - return ${HttpCodes.OK}`, async () => {
    const res = await request.get(`${apiPrefix}/`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toBeArray();
    expect(res.body.every((item) => expect(item).toContainAllKeys(articleShape)));
  });
  test(`GET /:id - correct - return ${HttpCodes.OK}`, async () => {
    const {id} = articles[0];
    const res = await request.get(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toContainAllKeys(articleShape);
  });
  test(`GET /:id - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const id = 999;
    const res = await request.get(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body.text).toBe(fm(`NO_ARTICLE_ID`, {id}));
  });
  test(`GET /categories/:categoryId - correct - return ${HttpCodes.OK}`, async () => {
    const {id} = categories[1];
    const res = await request.get(`${apiPrefix}/categories/${id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body.every((item) => expect(item).toContainAllKeys(articleShape)));
  });
  test(`GET /categories/:categoryId - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const id = 999;
    const res = await request.get(`${apiPrefix}/categories/${id}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body.text).toBe(fm(`NO_CATEGORY_ID`, {id}));
  });
  test(`GET /articles/my - return ${HttpCodes.OK}`, async () => {
    const res = await request.get(`${apiPrefix}/articles/my`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body.every((item) => expect(item).toContainAllKeys(articleShape)));
  });
  test(`GET /articles/search - empty - return ${HttpCodes.OK}`, async () => {
    const res = await request.get(`${apiPrefix}/articles/search`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toEqual({});
  });
  test(`GET /articles/search - not empty - return ${HttpCodes.OK}`, async () => {
    const query = `Senior`;
    const res = await request.get(`${apiPrefix}/articles/search?query=${query}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body.every((item) => {
      expect(item).toContainAllKeys(articleShape);
      expect(item.title).toMatch(query);
    }));
  });
  test(`GET /articles/hot - return ${HttpCodes.OK}`, async () => {
    const res = await request.get(`${apiPrefix}/articles/hot`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toBeArray();
    expect(res.body.every((item) => {
      expect(item[0]).toBeNumber();
      expect(item[1]).toBeNumber();
      expect(item[2]).toBeString();
    }));
  });
  test(`POST / - wrong - return ${HttpCodes.BAD_REQUEST}`, async () => {
    const res = await request.post(`${apiPrefix}/`).send({
      title: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      announce: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    });
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body.text).toIncludeAllMembers([
      {categories: fm(`MIN_CATEGORY_SELECTED`)},
    ]);
  });
  test(`POST / - correct - return ${HttpCodes.OK}`, async () => {
    const res = await request.post(`${apiPrefix}/`).send({
      title: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      announce: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      sentences: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      categories: [2, 3],
    });
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(+res.body).toBeNumber();
  });
  test(`PUT /:id - wrong - return ${HttpCodes.BAD_REQUEST}`, async () => {
    const id = 999;
    const res = await request.put(`${apiPrefix}/${id}`).send({
      title: `xxx`,
    });
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body.text).toIncludeAllMembers([
      {
        id: `${id}`,
        title: fm(`ARTICLE_TITLE_MINMAX_LETTERS`),
      },
    ]);
  });
  test(`PUT /:id - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const id = 999;
    const res = await request.put(`${apiPrefix}/${id}`).send({
      title: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    });
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body.text).toBe(fm(`NO_ARTICLE_ID`, {id}));
  });
  test(`PUT /:id - correct - return ${HttpCodes.OK}`, async () => {
    const {id} = articles[1];
    const newArticle = {
      title: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      announce: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      sentences: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      categories: [2, 3],
    };
    const res = await request.put(`${apiPrefix}/${id}`).send(newArticle);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toEqual({
      ...articles[1],
      ...newArticle,
    });
  });
  test(`DELETE /:id - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const id = 999;
    const res = await request.delete(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body.text).toBe(fm(`NO_ARTICLE_ID`, {id}));
  });
  test(`DELETE /:id - correct - return ${HttpCodes.OK}`, async () => {
    const {id} = articles[0];
    const res = await request.delete(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(+res.body).toBeNumber();
  });
});
