'use strict';

const {
  sequelize,
  initDatabase,
} = require(`./db-connection`);

(async () => {
  await initDatabase();
  await sequelize.close();
})();
