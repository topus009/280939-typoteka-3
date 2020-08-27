'use strict';

const {
  database,
  initDatabase,
} = require(`./db-connection`);
require(`../../../config/localization.setup`);

(async () => {
  await initDatabase();
  await database.close();
})();
