'use strict';

const {
  database,
  initDatabase,
} = require(`./db-connection`);

(async () => {
  await initDatabase();
  await database.close();
})();
