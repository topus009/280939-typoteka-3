'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {CustomError} = require(`../../../utils/utils`);

const router = (api) => {
  const usersRouter = new Router();

  usersRouter.get(`/`, async (req, res) => {
    const data = await api.users.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  usersRouter.get(`/:id`, async (req, res, next) => {
    try {
      const {id} = req.params;
      const data = await api.users.findById(id);
      if (data instanceof CustomError) {
        return next(data);
      }
      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  usersRouter.get(`/name/:name`, async (req, res, next) => {
    try {
      const {name} = req.params;
      const data = await api.users.getUserByName(name);
      if (data instanceof CustomError) {
        return next(data);
      }
      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  return usersRouter;
};

module.exports = router;
