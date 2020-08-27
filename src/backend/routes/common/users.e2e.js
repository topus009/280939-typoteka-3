'use strict';

const users = require(`../../../../mocks/users.json`);
const {
  MY_EMAIL,
  HttpCodes,
} = require(`../../../../config/constants`);
const fm = require(`../../../utils/localization`);

const apiPrefix = `/api/users`;

const mockedUser = {
  firstName: `aaaaaa`,
  lastName: `aaaaaa`,
  email: `aaaaaa@bbbb.com`,
  password: `aaaaaa`,
  passwordConfirmation: `aaaaaa`,
};

const userShape = [`id`, `firstName`, `email`, `role`, `lastName`, `avatar`, `avatarSmall`];

describe(`Testing end-points (${apiPrefix}...)`, () => {
  test(`GET / - return ${HttpCodes.OK}`, async () => {
    const res = await request.get(`${apiPrefix}/`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toBeArray();
    expect(res.body.every((item) => expect(item).toContainAllKeys(userShape)));
  });
  test(`GET /:id - correct - return ${HttpCodes.OK}`, async () => {
    const id = users[0].id;
    const res = await request.get(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toContainAllKeys(userShape);
  });
  test(`GET /:id - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const id = 999;
    const res = await request.get(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body.text).toBe(fm(`NO_USER_ID`, {id}));
  });
  test(`POST /auth/register - same email - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const userData = {
      firstName: `aaaaaa`,
      lastName: `aaaaaa`,
      email: MY_EMAIL,
      password: `aaaaaa`,
    };
    const res = await request.post(`${apiPrefix}/auth/register`).send(userData);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body.text).toIncludeAllMembers([
      {email: fm(`USER_WITH_EMAIL_EXISTS`, {email: userData.email})},
      {passwordConfirmation: fm(`PASSWORD_DONT_MATCH`)},
    ]);
  });
  test(`POST /auth/login - no-user - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const userData = {
      email: mockedUser.email,
      password: mockedUser.password,
    };
    const res = await request.post(`${apiPrefix}/auth/login`).send(userData);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body.text).toBe(fm(`USER_WITH_EMAIL_NOT_EXISTS`, {email: userData.email}));
  });
  test(`POST /auth/login - no-password - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const userData = {
      email: mockedUser.email,
    };
    const res = await request.post(`${apiPrefix}/auth/login`).send(userData);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body.text).toIncludeAllMembers([
      {password: fm(`PASSWORD_MIN_LETTERS`)},
    ]);
  });
  test(`POST /auth/register - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const res = await request.post(`${apiPrefix}/auth/register`).send({
      firstName: `aaaaaa`,
      email: `aaaaaa`,
      password: `aaaaaa`,
    });
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body.text).toIncludeAllMembers([
      {email: fm(`INVALID_EMAIL`)},
      {lastName: fm(`LASTNAME_ONLY_LETTERS`)},
      {passwordConfirmation: fm(`PASSWORD_DONT_MATCH`)},
    ]);
  });
  test(`POST /auth/register - correct - return ${HttpCodes.OK}`, async () => {
    const res = await request.post(`${apiPrefix}/auth/register`).send(mockedUser);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toContainAllKeys(userShape);
  });
  test(`POST /auth/login - correct - return ${HttpCodes.OK}`, async () => {
    const res = await request.post(`${apiPrefix}/auth/login`).send({
      email: mockedUser.email,
      password: mockedUser.password,
    });
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toBeNumber();
  });
});
