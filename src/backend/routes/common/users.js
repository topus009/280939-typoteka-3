'use strict';

const path = require(`path`);
const fsFromises = require(`fs`).promises;
const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {
  validate,
  rules,
} = require(`../../validation`);
const {
  CustomError,
  catchAsync,
} = require(`../../../utils/utils`);

const router = (api) => {
  const usersRouter = new Router();

  usersRouter.get(`/`, catchAsync(async (req, res) => {
    const data = await api.users.getAll();
    res.status(HttpCodes.OK).json(data);
  }));

  usersRouter.get(`/:id`, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const data = await api.users.findById(id);
    if (data instanceof CustomError) {
      return next(data);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  usersRouter.post(`/register`, [
    rules.user(api),
    validate,
  ], catchAsync(async (req, res) => {
    if (req.body.file) {
      const {file} = req.body;
      const backendImgPath = `img/avatars/${file.filename}`;
      await fsFromises.rename(file.path, path.join(process.cwd(), `./src/frontend/public/${backendImgPath}`));
      delete req.body.file;
      req.body.avatar = backendImgPath;
      req.body.avatarSmall = backendImgPath;
    }
    const data = await api.users.add(req.body);
    return res.status(HttpCodes.OK).json(data);
  }));

  return usersRouter;
};

module.exports = router;
