'use strict';

const {body} = require(`express-validator`);
const path = require(`path`);

const user = (api) => ([
  body(`email`)
    .isEmail()
    .withMessage(`Email is not valid`)
    .custom(async (email) => {
      const data = await api.users.findByEmail(email);
      if (data) {
        throw new Error(_f(`USER_WITH_EMAIL_EXISTS`, {email}));
      }
    }),
  body(`firstName`)
    .trim()
    .exists()
    .matches(/^(?=.{1,40}$)[a-zA-Zа-яА-Я]+(?:[-'][a-zA-Z]+)*$/)
    .withMessage(`Firstname shouldn't contain digits and special characters`),
  body(`lastName`)
    .trim()
    .exists()
    .matches(/^(?=.{1,40}$)[a-zA-Zа-яА-Я]+(?:[-'][a-zA-Z]+)*$/)
    .withMessage(`Lastname shouldn't contain digits and special characters`),
  body(`password`)
    .trim()
    .isLength({min: 6})
    .withMessage(`Password must be at least 6 characters`),
  body(`passwordConfirmation`)
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    })
    .withMessage(`Passwords don't match`),
  body(`file`)
    .custom((file) => {
      if (!file) {
        return true;
      } else {
        const ext = path.extname(file.originalname);
        return validExtensions.includes(ext);
      }
    })
    .withMessage(`Only png,jpg,jpeg files supported`),
]);

const category = (api) => ([
  body(`label`)
    .isLength({min: 5, max: 30})
    .withMessage(`The name must contain at least 5 characters and a maximum of 30`)
    .custom(async (label) => {
      const data = await api.categories.findByLabel(label);
      if (data) {
        throw new Error(_f(`DUPLICATE_CATEGORY_LABEL`, {label}));
      }
    }),
]);

const comment = () => ([
  body(`comment`)
    .isLength({min: 20})
    .withMessage(`Comment must be at least 20 characters`),
]);

const validExtensions = [`.png`, `.jpg`, `.jpeg`];

const articleValidators = (api) => ({
  title: (fieldEl) => fieldEl
    .isLength({min: 30, max: 250})
    .withMessage(`The title must contain a minimum of 30 characters and a maximum of 250`),
  file: (fieldEl) => fieldEl
    .custom((file) => {
      if (!file) {
        return true;
      } else {
        const ext = path.extname(file.originalname);
        return validExtensions.includes(ext);
      }
    })
    .withMessage(`Only png,jpg,jpeg files supported`),
  categories: (fieldEl) => fieldEl
    .toArray()
    .isArray({min: 1})
    .withMessage(`At least 1 category must be selected`)
    .custom(async (arr) => {
      await Promise.all(arr.map((id) => api.categories.findById(id)));
    }),
  announce: (fieldEl) => fieldEl
    .isLength({min: 30, max: 250})
    .withMessage(`The announcement must contain a minimum of 30 characters and a maximum of 250`),
  sentences: (fieldEl) => fieldEl
    .isLength({max: 1000})
    .withMessage(`Publication text must not exceed 1000 characters`),
});


const article = (api, optional) => {
  const articleFields = {
    title: optional ? body(`title`).optional() : body(`title`),
    file: optional ? body(`file`).optional() : body(`file`),
    categories: optional ? body(`categories`).optional() : body(`categories`),
    announce: optional ? body(`announce`).optional() : body(`announce`),
    sentences: optional ? body(`sentences`).optional() : body(`sentences`),
  };
  return Object.keys(articleFields).map((field) => articleValidators(api)[field](articleFields[field]));
};

const rules = {
  user,
  category,
  comment,
  article,
};

module.exports = rules;
