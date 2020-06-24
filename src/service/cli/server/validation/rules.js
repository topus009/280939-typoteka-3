'use strict';

const {body} = require(`express-validator`);

const category = () => ([
  body(`label`)
    .isLength({min: 5, max: 30})
    .withMessage(`Название должно содержать как минимум 5 символов и максимум 30`)
]);

const comment = () => ([
  body(`text`)
    .isLength({min: 20})
    .withMessage(`Комментарий должен содержать как минимум 20 символов`)
]);

const post = () => ([
  body(`title`)
    .isLength({min: 30, max: 250})
    .withMessage(`Заголовок должен содержать минимум 30 символов и максимум 250`),
  body(`categories`)
    .toArray()
    .isArray({min: 1})
    .withMessage(`Должна быть выбрана хотя бы 1 категория`),
  body(`announce`)
    .isLength({min: 30, max: 250})
    .withMessage(`Анонс должен содержать минимум 30 символов и максимум 250`),
  body(`sentences`)
    .isLength({max: 1000})
    .withMessage(`Текст публикации не должен превышать 1000 символов`),
]);

const rules = {
  category,
  comment,
  post,
};

module.exports = rules;
