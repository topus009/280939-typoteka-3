'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../../config/constants`);

const router = (api) => {
  const usersRouter = new Router();

  usersRouter.get(`/`, (req, res) => {
    const data = api.users.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  usersRouter.get(`/:id`, (req, res) => {
    const {id} = req.params;
    const data = api.users.findById(id);
    res.status(HttpCodes.OK).json(data);
  });

  usersRouter.get(`/name/:name`, (req, res) => {
    const {name} = req.params;
    const data = api.users.getUserByName(name);
    res.status(HttpCodes.OK).json(data);
  });

  return usersRouter;
};

module.exports = router;
