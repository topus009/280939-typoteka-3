'use strict';

const {HttpCodes} = require(`../../../../config/constants`);
const comments = require(`../../../../mocks/comments.json`);

const apiPrefix = `/api/comments`;

const commentShape = [`id`, `comment`, `userId`, `articleId`, `createdDate`];

describe(`Testing end-points (${apiPrefix}...)`, () => {
  test(`GET / - return ${HttpCodes.OK}`, async () => {
    const res = await request.get(`${apiPrefix}/`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toBeArray();
    expect(res.body.every((item) => expect(item).toContainAllKeys(commentShape)));
  });
  test(`GET /article/:articleId - correct - return ${HttpCodes.OK}`, async () => {
    const {articleId} = comments[0];
    const res = await request.get(`${apiPrefix}/article/${articleId}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body.every((item) => expect(item).toContainAllKeys(commentShape)));
  });
  test(`GET /article/:articleId - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const id = 999;
    const res = await request.get(`${apiPrefix}/article/${id}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body.text).toBe(_f(`NO_ARTICLE_ID`, {id}));
  });
  test(`GET /article/:articleId/:id - correct - return ${HttpCodes.OK}`, async () => {
    const {articleId, id} = comments[0];
    const res = await request.get(`${apiPrefix}/article/${articleId}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toContainAllKeys(commentShape);
  });
  test(`GET /article/:articleId/:id - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const id = 999;
    const res = await request.get(`${apiPrefix}/article/999/${id}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body.text).toBe(_f(`NO_COMMENT_ID`, {id}));
  });
  test(`GET /comments/my - return ${HttpCodes.OK}`, async () => {
    const res = await request.get(`${apiPrefix}/comments/my`);
    expect(res.statusCode).toBe(HttpCodes.OK);
  });
  test(`GET /comments/latest - return ${HttpCodes.OK}`, async () => {
    const res = await request.get(`${apiPrefix}/comments/latest`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body.every((item) => expect(item).toContainAllKeys(commentShape)));
  });
  test(`POST /article/:articleId - wrong - return ${HttpCodes.BAD_REQUEST}`, async () => {
    const {articleId, userId} = comments[0];
    const commentData = {
      comment: `dasd asdas dasd`,
      userId,
    };
    const res = await request.post(`${apiPrefix}/article/${articleId}`).send(commentData);
    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
    expect(res.body.text).toIncludeAllMembers([
      {comment: _f(`COMMENT_MIN_LETTERS`)},
    ]);
  });
  test(`POST /article/:articleId - correct - return ${HttpCodes.OK}`, async () => {
    const {articleId, userId} = comments[0];
    const res = await request.post(`${apiPrefix}/article/${articleId}`).send({
      comment: `ascascaasc as asda sd asd ad asd asd asd asdas dasd asdas dasd`,
      userId,
    });
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(res.body).toContainAllKeys(commentShape);
  });
  test(`DELETE /article/:articleId/:id - wrong - return ${HttpCodes.NOT_FOUND}`, async () => {
    const {articleId} = comments[2];
    const id = 999;
    const res = await request.delete(`${apiPrefix}/article/${articleId}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
    expect(res.body.text).toBe(_f(`NO_COMMENT_ID`, {id}));
  });
  test(`DELETE /article/:articleId/:id - correct - return ${HttpCodes.OK}`, async () => {
    const {articleId, id} = comments[1];
    const res = await request.delete(`${apiPrefix}/article/${articleId}/${id}`);
    expect(res.statusCode).toBe(HttpCodes.OK);
    expect(+res.body).toBeNumber();
  });
});
