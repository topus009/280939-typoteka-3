"use strict";

const formatMessage = require(`format-message`);

formatMessage.setup({
  locale: `ru`,
  translations: {
    ru: require(`./locales/ru.json`)
  },
});

global._f = formatMessage;
