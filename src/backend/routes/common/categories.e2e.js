'use strict';

const supertest = require(`supertest`);
const categories = require(`../../../../mocks/categories.json`);
const {createServer} = require(`../../server`);

let server;
let request;

beforeAll(async (done) => {
  server = await createServer();
  request = supertest(server);
  done();
});

const apiPrefix = `/api/categories`;

describe(`Testing end-points (${apiPrefix}...)`, () => {
  test(`GET / - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/`);
    expect(res.statusCode).toBe(200);
  });
  test(`POST / - correct - return 200`, async () => {
    const res = await request.post(`${apiPrefix}/`).send({
      label: `xxxxxx`
    });
    expect(res.statusCode).toBe(200);
    expect(Number(res.body)).toBeNumber();
  });
  test(`POST / - wrong - return 400`, async () => {
    const res = await request.post(`${apiPrefix}/`).send({
      label: `xxx`
    });
    expect(res.statusCode).toBe(400);
  });
  test(`GET /:id - correct - return 200`, async () => {
    const {id} = categories[0];
    const res = await request.get(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /:id - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/999`);
    expect(res.statusCode).toBe(404);
  });
  test(`GET /categories/my - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/categories/my`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /categories/count - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/categories/count`);
    expect(res.statusCode).toBe(200);
  });
  test(`DELETE / - correct - return 200`, async () => {
    const {id} = categories[0];
    const res = await request.delete(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(200);
    expect(Number(res.body)).toBeNumber();
  });
  test(`DELETE / - wrong - return 404`, async () => {
    const res = await request.delete(`${apiPrefix}/999`);
    expect(res.statusCode).toBe(404);
  });
});
