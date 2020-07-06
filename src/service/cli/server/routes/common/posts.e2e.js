'use strict';

const supertest = require(`supertest`);
const posts = require(`../../../../../../mockData/mocks.json`);
const categories = require(`../../../../../../mockData/categories.json`);
const {createServer} = require(`../../server`);

let server;
let request;

beforeAll(async (done) => {
  server = await createServer();
  request = supertest(server);
  done();
});

const apiPrefix = `/api/common/posts`;

describe(`Testing end-points (${apiPrefix}...)`, () => {
  test(`GET / - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /:id - correct - return 200`, async () => {
    const {id} = posts[0];
    const res = await request.get(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /:id - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/xxx`);
    expect(res.statusCode).toBe(404);
  });
  test(`GET /categories/:categoryId - correct - return 200`, async () => {
    const {id: categoryId} = categories[0];
    const res = await request.get(`${apiPrefix}/categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
  });
  test(`POST / - correct - return 200`, async () => {
    const res = await request.post(`${apiPrefix}/`).send({
      title: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      announce: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      sentences: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      categories: [`xxxxxxxx`, `xxxxxxxx`],
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(21);
    expect(res.body).toBeString();
  });
  test(`POST / - wrong - return 400`, async () => {
    const res = await request.post(`${apiPrefix}/`).send({
      title: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      announce: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
    });
    expect(res.statusCode).toBe(400);
  });
  test(`DELETE /:id - correct - return 200`, async () => {
    const {id} = posts[0];
    const res = await request.delete(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(200);
  });
  test(`DELETE /:id - wrong - return 404`, async () => {
    const res = await request.delete(`${apiPrefix}/xxx`);
    expect(res.statusCode).toBe(404);
  });
  test(`PUT /:id - correct - return 200`, async () => {
    const {id} = posts[1];
    const newPost = {
      title: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      announce: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      sentences: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      categories: [`xxxxxxxx`, `xxxxxxxx`],
    };
    const res = await request.put(`${apiPrefix}/${id}`).send(newPost);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({...posts[1], ...newPost});
  });
  test(`PUT /:id - wrong - return 400`, async () => {
    const res = await request.put(`${apiPrefix}/xxx`).send({
      title: `xxx`,
    });
    expect(res.statusCode).toBe(400);
  });
  test(`GET /categories/:categoryId - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/categories/xxx`);
    expect(res.statusCode).toBe(404);
  });
  test(`GET /posts/my - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/posts/my`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /posts/search - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/posts/search`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /posts/hot - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/posts/hot`);
    expect(res.statusCode).toBe(200);
  });
});
