'use strict';

const {body} = require(`express-validator`);
const path = require(`path`);

const {validExtensions} = require(`../../../utils/upload`);

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

module.exports = user;
