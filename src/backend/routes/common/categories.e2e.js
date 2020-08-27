'use strict';

const categories = require(`../../../../mocks/categories.json`);
const {HttpCodes} = require(`../../../../config/constants`);
const fm = require(`../../../utils/localization`);

const apiPrefix = `/api/categories`;

const categoryShape = [`id`, `label`];

describe(`Testing end-points (${apiPrefix}...)`, () => {
  test(`GET / - return ${HttpCodes.OK}`, async () => {
    const res = await request.get(`${apiPrefix}/`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toBeArray();
    expect(res.body.every((item) => expect(item).toContainAllKeys(categoryShape)));
  });
  test(`GET /:id - correct - return ${HttpCodes.OK}`, async () => {
    const {id} = categories[0];
    const res = await request.get(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toContainAllKeys(categoryShape);
  });
  test(`GET /:id - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const id = 999;
    const res = await request.get(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body.text).toBe(fm(`NO_CATEGORY_ID`, {id}));
  });
  test(`GET /categories/my - return ${HttpCodes.OK}`, async () => {
    const res = await request.get(`${apiPrefix}/categories/my`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toBeArray();
    expect(res.body.every((item) => expect(item).toContainAllKeys(categoryShape)));
  });
  test(`GET /categories/count - return ${HttpCodes.OK}`, async () => {
    const res = await request.get(`${apiPrefix}/categories/count`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(Object.keys(res.body).every((key) => {
      expect(res.body[key]).toBeNumber();
      expect(+key).toBeNumber();
    }));
  });
  test(`POST / - wrong - return ${HttpCodes.BAD_REQUEST}`, async () => {
    const res = await request.post(`${apiPrefix}/`).send({
      label: `xxx`,
    });
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body.text).toIncludeAllMembers([
      {label: fm(`CATEGORY_LABEL_MINMAX_LETTERS`)},
    ]);
  });
  test(`PUT / - wrong - return ${HttpCodes.BAD_REQUEST}`, async () => {
    const {id} = categories[0];
    const res = await request.put(`${apiPrefix}/${id}`).send({
      label: `xxx`,
    });
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body.text).toIncludeAllMembers([
      {
        id: `${id}`,
        label: fm(`CATEGORY_LABEL_MINMAX_LETTERS`),
      },
    ]);
  });
  test(`PUT / - correct - return ${HttpCodes.OK}`, async () => {
    const {id} = categories[0];
    const res = await request.put(`${apiPrefix}/${id}`).send({
      label: `xxxxxx`,
    });
    expect(res.statusCode).toBe(HttpCodes.OK);
  });
  test(`PUT / - wrong - duplicate - return ${HttpCodes.BAD_REQUEST}`, async () => {
    const {id} = categories[0];
    const categoryDate = {
      label: `xxxxxx`,
    };
    const res = await request.put(`${apiPrefix}/${id}`).send(categoryDate);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body.text).toIncludeAllMembers([
      {
        id: `${id}`,
        label: fm(`DUPLICATE_CATEGORY_LABEL`, categoryDate),
      },
    ]);
  });
  test(`POST / - correct - return ${HttpCodes.OK}`, async () => {
    const res = await request.post(`${apiPrefix}/`).send({
      label: `xxxxxxx`,
    });
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toContainAllKeys(categoryShape);
  });
  test(`POST / - wrong - duplicate - return ${HttpCodes.BAD_REQUEST}`, async () => {
    const categoryDate = {
      label: `xxxxxxx`,
    };
    const res = await request.post(`${apiPrefix}/`).send(categoryDate);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body.text).toIncludeAllMembers([
      {label: fm(`DUPLICATE_CATEGORY_LABEL`, categoryDate)},
    ]);
  });
  test(`DELETE / - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const id = 999;
    const res = await request.delete(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body.text).toBe(fm(`NO_CATEGORY_ID`, {id}));
  });
  test(`DELETE / - correct - return ${HttpCodes.OK}`, async () => {
    const {id} = categories[0];
    const res = await request.delete(`${apiPrefix}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(+res.body).toBeNumber();
  });
});
