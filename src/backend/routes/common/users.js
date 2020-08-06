'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
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

  usersRouter.get(`/name/:name`, catchAsync(async (req, res, next) => {
    const {name} = req.params;
    const data = await api.users.getUserByName(name);
    if (data instanceof CustomError) {
      return next(data);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  return usersRouter;
};

module.exports = router;
