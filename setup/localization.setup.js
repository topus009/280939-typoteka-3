"use strict";

const formatMessage = require(`format-message`);

formatMessage.setup({
  locale: `en`,
  translations: {
    en: require(`./locales/en.json`)
  },
});

global._f = formatMessage;
