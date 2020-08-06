'use strict';

const supertest = require(`supertest`);
const comments = require(`../../../../mocks/comments.json`);
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
    const {articleId} = comments[0];
    const res = await request.get(`${apiPrefix}/article/${articleId}`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /article/:articleId - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/article/999`);
    expect(res.statusCode).toBe(404);
  });
  test(`GET /article/:articleId/:id - correct - return 200`, async () => {
    const {articleId, id} = comments[0];
    const res = await request.get(`${apiPrefix}/article/${articleId}/${id}`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /article/:articleId/:id - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/article/999/999`);
    expect(res.statusCode).toBe(404);
  });
  test(`POST /article/:articleId - correct - return 200`, async () => {
    const {articleId} = comments[0];
    const res = await request.post(`${apiPrefix}/article/${articleId}`).send({
      comment: `ascascaasc as asda sd asd ad asd asd asd asdas dasd asdas dasd`
    });
    expect(res.statusCode).toBe(200);
    expect(Number(res.body)).toBeNumber();
  });
  test(`POST /article/:articleId - wrong - return 400`, async () => {
    const {articleId} = comments[0];
    const res = await request.post(`${apiPrefix}/article/${articleId}`).send({
      comment: `dasd asdas dasd`
    });
    expect(res.statusCode).toBe(400);
  });
  test(`GET /comments/my - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/comments/my`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /comments/latest - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/comments/latest`);
    expect(res.statusCode).toBe(200);
  });
  test(`DELETE /article/:articleId/:id - correct - return 200`, async () => {
    const {articleId, id} = comments[1];
    const res = await request.delete(`${apiPrefix}/article/${articleId}/${id}`);
    expect(res.statusCode).toBe(200);
    expect(Number(res.body)).toBeNumber();
  });
  test(`DELETE /article/:articleId/:id - wrong - return 404`, async () => {
    const {articleId} = comments[2];
    const res = await request.delete(`${apiPrefix}/article/${articleId}/999`);
    expect(res.statusCode).toBe(404);
  });
});
