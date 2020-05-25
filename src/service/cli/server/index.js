'use strict';
const http = require(`http`);
const chalk = require(`chalk`);
const {
  parseCommandParam,
} = require(`../../../utils/utils`);
const router = require(`./router`);

const DEFAULT_PORT = process.env.PORT || 3000;

const runServer = (port) => {
  const httpServer = http.createServer(router);

  httpServer.listen(port, (err) => {
    if (err) {
      return console.log(chalk.red(`Ошибка при создании http-сервера.`), chalk.red(err));
    }

    return console.log(chalk.green(`Сервер запущен на порту ${port}`));
  });
};

module.exports = {
  name: `--server`,
  run(input) {
    let port = DEFAULT_PORT;
    const userPort = parseCommandParam(input);
    if (!isNaN(userPort)) {
      port = userPort;
    }
    runServer(port);
  }
};
