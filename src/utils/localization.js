"use strict";

const formatMessage = require(`format-message`);
const messagesEN = require(`../../config/locales/en.json`);
const {DEFAULT_LOCALIZATION_LOCALE} = require(`../../config/constants`);

formatMessage.setup({
  locale: DEFAULT_LOCALIZATION_LOCALE,
  translations: {
    en: messagesEN,
  },
});

module.exports = formatMessage;
