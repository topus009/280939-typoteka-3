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

const mockedUser = {
  firstName: `aaaaaa`,
  lastName: `aaaaaa`,
  email: `aaaaaa@bbbb.com`,
  password: `aaaaaa`,
  passwordConfirmation: `aaaaaa`
};

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
  test(`POST /auth/register - same email - wrong - return 404`, async () => {
    const res = await request.post(`${apiPrefix}/auth/register`).send({
      firstName: `aaaaaa`,
      lastName: `aaaaaa`,
      email: MY_EMAIL,
      password: `aaaaaa`,
    });
    expect(res.statusCode).toBe(400);
  });
  test(`POST /auth/login - no-user - wrong - return 404`, async () => {
    const res = await request.post(`${apiPrefix}/auth/login`).send({
      email: mockedUser.email,
      password: mockedUser.password,
    });
    expect(res.statusCode).toBe(400);
  });
  test(`POST /auth/login - no-password - wrong - return 404`, async () => {
    const res = await request.post(`${apiPrefix}/auth/login`).send({
      email: mockedUser.email,
    });
    expect(res.statusCode).toBe(400);
  });
  test(`POST /auth/register - wrong - return 404`, async () => {
    const res = await request.post(`${apiPrefix}/auth/register`).send({
      firstName: `aaaaaa`,
      email: `aaaaaa`,
      password: `aaaaaa`,
    });
    expect(res.statusCode).toBe(400);
  });
  test(`POST /auth/register - correct - return 200`, async () => {
    const res = await request.post(`${apiPrefix}/auth/register`).send(mockedUser);
    expect(res.statusCode).toBe(200);
  });
  test(`POST /auth/login - correct - return 200`, async () => {
    const res = await request.post(`${apiPrefix}/auth/login`).send({
      email: mockedUser.email,
      password: mockedUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeNumber();
  });
});
