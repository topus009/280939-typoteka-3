'use strict';

const ch = require(`chalk`);

const message = `
Программа запускает ${ch.cyan(`http-сервер`)} и формирует файл с данными для API.

    Гайд:
    ${ch.green(`service.js`)} <${ch.yellow(`command`)}>
    Команды:
    ${ch.green(`--version`)}:            выводит номер версии
    ${ch.green(`--help`)}:               печатает этот текст
    ${ch.green(`--generate`)} <${ch.yellow(`count`)}>    формирует файл ${ch.yellow(`mocks.json`)}
    ${ch.green(`--server`)} <${ch.yellow(`port`)}>    запуск http-сервера на указанном порту
`;

module.exports = {
  name: `--help`,
  run() {
    console.log(message);
  }
};
