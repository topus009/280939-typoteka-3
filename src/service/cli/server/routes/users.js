'use strict';

const {Router} = require(`express`);
const {readFileAsync} = require(`../../../../utils/utils`);
const {MockFilesPaths, HttpCodes} = require(`../../../../config/constants`);

const usersRouter = new Router();

usersRouter.get(`*`, async (req, res) => {
  try {
    const data = await readFileAsync(MockFilesPaths.USERS);
    res.status(HttpCodes.HTTP_SUCCESS_CODE).send(...data);
  } catch (err) {
    res.send([]);
  }
  return;
});

module.exports = usersRouter;
