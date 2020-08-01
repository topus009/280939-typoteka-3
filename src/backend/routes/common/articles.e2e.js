'use strict';

const supertest = require(`supertest`);
const articles = require(`../../../../mocks/articles.json`);
const categories = require(`../../../../mocks/categories.json`);
const {createServer} = require(`../../server`);

let server;
let request;

beforeAll(async (done) => {
  server = await createServer();
  request = supertest(server);
  done();
});

const apiPrefix = `/api/articles`;

describe(`Testing end-points (${apiPrefix}...)`, () => {
  test(`GET / - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /:id - correct - return 200`, async () => {
    const {id} = articles[0];
    const res = await request.get(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /:id - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/999`);
    expect(res.statusCode).toBe(404);
  });
  test(`GET /categories/:categoryId - correct - return 200`, async () => {
    const {id} = categories[1];
    const res = await request.get(`${apiPrefix}/categories/${id}`);
    expect(res.statusCode).toBe(200);
  });
  test(`POST / - correct - return 200`, async () => {
    const res = await request.post(`${apiPrefix}/`).send({
      title: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      announce: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      sentences: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      categories: [1, 2],
    });
    expect(res.statusCode).toBe(200);
    expect(Number(res.body)).toBeNumber();
  });
  test(`POST / - wrong - return 400`, async () => {
    const res = await request.post(`${apiPrefix}/`).send({
      title: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      announce: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    });
    expect(res.statusCode).toBe(400);
  });
  test(`DELETE /:id - correct - return 200`, async () => {
    const {id} = articles[0];
    const res = await request.delete(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(200);
  });
  test(`DELETE /:id - wrong - return 404`, async () => {
    const res = await request.delete(`${apiPrefix}/999`);
    expect(res.statusCode).toBe(404);
  });
  test(`PUT /:id - correct - return 200`, async () => {
    const {id} = articles[1];
    const newArticle = {
      title: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      announce: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      sentences: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      categories: [1, 2],
    };
    const res = await request.put(`${apiPrefix}/${id}`).send(newArticle);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({...articles[1], ...newArticle});
  });
  test(`PUT /:id - wrong - return 400`, async () => {
    const res = await request.put(`${apiPrefix}/999`).send({
      title: `xxx`,
    });
    expect(res.statusCode).toBe(400);
  });
  test(`GET /categories/:categoryId - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/categories/999`);
    expect(res.statusCode).toBe(404);
  });
  test(`GET /articles/my - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/articles/my`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /articles/search - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/articles/search`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /articles/hot - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/articles/hot`);
    expect(res.statusCode).toBe(200);
  });
});
