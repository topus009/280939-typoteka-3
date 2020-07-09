'use strict';

const supertest = require(`supertest`);
const comments = require(`../../../../../../mocks/comments.json`);
const {createServer} = require(`../../server`);

let server;
let request;

beforeAll(async (done) => {
  server = await createServer();
  request = supertest(server);
  done();
});

const apiPrefix = `/api/comments`;

describe(`Testing end-points (${apiPrefix}...)`, () => {
  test(`GET / - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /article/:articleId - correct - return 200`, async () => {
    const articleId = Object.keys(comments)[0];
    const res = await request.get(`${apiPrefix}/article/${articleId}`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /article/:articleId - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/article/xxx`);
    expect(res.statusCode).toBe(404);
  });
  test(`GET /article/:articleId/:id - correct - return 200`, async () => {
    const articleId = Object.keys(comments)[0];
    const {id} = comments[articleId][0];
    const res = await request.get(`${apiPrefix}/article/${articleId}/${id}`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /article/:articleId/:id - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/article/xxx/xxx`);
    expect(res.statusCode).toBe(404);
  });
  test(`POST /article/:articleId - correct - return 200`, async () => {
    const articleId = Object.keys(comments)[0];
    const res = await request.post(`${apiPrefix}/article/${articleId}`).send({
      text: `ascascaasc as asda sd asd ad asd asd asd asdas dasd asdas dasd`
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(21);
    expect(res.body).toBeString();
  });
  test(`POST /article/:articleId - wrong - return 400`, async () => {
    const articleId = Object.keys(comments)[0];
    const res = await request.post(`${apiPrefix}/article/${articleId}`).send({
      text: `dasd asdas dasd`
    });
    expect(res.statusCode).toBe(400);
  });
  test(`DELETE /article/:articleId/:id - correct - return 200`, async () => {
    const articleId = Object.keys(comments)[0];
    const {id} = comments[articleId][0];
    const res = await request.delete(`${apiPrefix}/article/${articleId}/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(21);
    expect(res.body).toBeString();
  });
  test(`DELETE /article/:articleId/:id - wrong - return 404`, async () => {
    const articleId = Object.keys(comments)[0];
    const res = await request.delete(`${apiPrefix}/article/${articleId}/xxx`);
    expect(res.statusCode).toBe(404);
  });
  test(`GET /comments/my - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/comments/my`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /comments/latest - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/comments/latest`);
    expect(res.statusCode).toBe(200);
  });
});
