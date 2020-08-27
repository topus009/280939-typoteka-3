"use strict";

const formatMessage = require(`format-message`);
const messagesEN = require(`./locales/en.json`);
const {DEFAULT_LOCALIZATION_LOCALE} = require(`./constants`);

formatMessage.setup({
  locale: DEFAULT_LOCALIZATION_LOCALE,
  translations: {
    en: messagesEN,
  },
});

global._f = formatMessage;
