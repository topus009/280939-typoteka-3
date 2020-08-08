'use strict';

const supertest = require(`supertest`);
const users = require(`../../../../mocks/users.json`);
const {createServer} = require(`../../server`);
const {MY_EMAIL} = require(`../../../../config/constants`);

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
    const res = await request.get(`${apiPrefix}/999`);
    expect(res.statusCode).toBe(404);
  });
  test(`POST /register - correct - return 200`, async () => {
    const res = await request.post(`${apiPrefix}/register`).send({
      firstName: `aaaaaa`,
      lastName: `aaaaaa`,
      email: `aaaaaa@bbbb.com`,
      password: `aaaaaa`,
      passwordConfirmation: `aaaaaa`
    });
    expect(res.statusCode).toBe(200);
  });
  test(`POST /register - same email - wrong - return 404`, async () => {
    const res = await request.post(`${apiPrefix}/register`).send({
      firstName: `aaaaaa`,
      lastName: `aaaaaa`,
      email: MY_EMAIL,
      password: `aaaaaa`,
    });
    expect(res.statusCode).toBe(400);
  });
  test(`POST /register - wrong - return 404`, async () => {
    const res = await request.post(`${apiPrefix}/register`).send({
      firstName: `aaaaaa`,
      email: `aaaaaa`,
      password: `aaaaaa`,
    });
    expect(res.statusCode).toBe(400);
  });
});
