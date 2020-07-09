'use strict';

const supertest = require(`supertest`);
const users = require(`../../../../../../mocks/users.json`);
const {createServer} = require(`../../server`);

let server;
let request;

beforeAll(async (done) => {
  server = await createServer();
  request = supertest(server);
  done();
});

const apiPrefix = `/api/users`;

describe(`Testing end-points (${apiPrefix}...)`, () => {
  test(`GET / - return 200`, async () => {
    const res = await request.get(`${apiPrefix}/`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /:id - correct - return 200`, async () => {
    const id = users[0].id;
    const res = await request.get(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /:id - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/x`);
    expect(res.statusCode).toBe(404);
  });
  test(`GET /name/:name - correct - return 200`, async () => {
    const name = users[0].name;
    const res = await request.get(`${apiPrefix}/name/${name}`);
    expect(res.statusCode).toBe(200);
  });
  test(`GET /name/:name - wrong - return 404`, async () => {
    const res = await request.get(`${apiPrefix}/name/x`);
    expect(res.statusCode).toBe(404);
  });
});
