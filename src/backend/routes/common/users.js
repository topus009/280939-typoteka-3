'use strict';

const {Router} = require(`express`);
const {
  HttpCodes,
  BACKEND_AVATARS_PATH,
} = require(`../../../../config/constants`);
const {catchAsync} = require(`../../../utils/utils`);
const {saveFile} = require(`../../../utils/upload`);
const {
  validationMiddleware,
  rulesMiddleware,
} = require(`../../validation`);

const usersRouter = new Router();

const router = (api) => {
  usersRouter.get(`/`, catchAsync(async (req, res) => {
    const data = await api.users.getAll();
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  usersRouter.get(`/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const data = await api.users.findById(id);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  usersRouter.post(`/auth/register`, [
    rulesMiddleware.user.registration(api),
    validationMiddleware,
  ], catchAsync(async (req, res) => {
    const fieldNames = [`avatar`, `avatarSmall`];
    await saveFile(req, BACKEND_AVATARS_PATH, fieldNames);
    const data = await api.users.add(req.body);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  usersRouter.post(`/auth/login`, [
    rulesMiddleware.user.login(),
    validationMiddleware,
  ], catchAsync(async (req, res) => {
    const data = await api.users.auth(req.body);
    res.status(HttpCodes.OK).json(data);
    return;
  }));
  return usersRouter;
};

module.exports = router;
