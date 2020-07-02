'use strict';

const supertest = require(`supertest`);
const comments = require(`../../../../../../mockData/comments.json`);
const {createServer} = require(`../../server`);

let server;
let request;

beforeAll(async (done) => {
  server = await createServer();
  request = supertest(server);
  done();
});

const apiPrefix = `/api/common/comments`;

describe(`Testing end-points (${apiPrefix}...)`, () => {
  test(`GET / - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /post/:postId - correct - return 200`, async () => {
    const postId = Object.keys(comments)[0];
    const res = await request.get(`${apiPrefix}/post/${postId}`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /post/:postId - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/post/xxx`);
    expect(res.statusCode).toBe(404);
  });
  test(`GET /post/:postId/:id - correct - return 200`, async () => {
    const postId = Object.keys(comments)[0];
    const {id} = comments[postId][0];
    const res = await request.get(`${apiPrefix}/post/${postId}/${id}`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /post/:postId/:id - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/post/xxx/xxx`);
    expect(res.statusCode).toBe(404);
  });
  test(`POST /post/:postId - correct - return 200`, async () => {
    const postId = Object.keys(comments)[0];
    const res = await request.post(`${apiPrefix}/post/${postId}`).send({
      text: `ascascaasc as asda sd asd ad asd asd asd asdas dasd asdas dasd`
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(21);
    expect(res.body).toBeString();
  });
  test(`POST /post/:postId - wrong - return 400`, async () => {
    const postId = Object.keys(comments)[0];
    const res = await request.post(`${apiPrefix}/post/${postId}`).send({
      text: `dasd asdas dasd`
    });
    expect(res.statusCode).toBe(400);
  });
  test(`DELETE /post/:postId/:id - correct - return 200`, async () => {
    const postId = Object.keys(comments)[0];
    const {id} = comments[postId][0];
    const res = await request.delete(`${apiPrefix}/post/${postId}/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(21);
    expect(res.body).toBeString();
  });
  test(`DELETE /post/:postId/:id - wrong - return 404`, async () => {
    const postId = Object.keys(comments)[0];
    const res = await request.delete(`${apiPrefix}/post/${postId}/xxx`);
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
