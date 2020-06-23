'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../../config/constants`);

const router = (Api) => {
  const usersRouter = new Router();

  usersRouter.get(`/`, (req, res) => {
    const data = Api.users.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  usersRouter.get(`/:id`, (req, res) => {
    const {id} = req.params;
    const data = Api.users.findById(id);
    res.status(HttpCodes.OK).json(data);
  });

  usersRouter.get(`/name/:name`, (req, res) => {
    const {name} = req.params;
    const data = Api.users.getUserByName(name);
    res.status(HttpCodes.OK).json(data);
  });

  return usersRouter;
};

module.exports = router;
