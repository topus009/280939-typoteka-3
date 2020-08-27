'use strict';

const {body} = require(`express-validator`);
const path = require(`path`);
const {
  VALID_NAME_REGEXP,
  PASSWORD_MIN_LETTERS,
  ValidImgExtensions,
} = require(`../../../../config/constants`);
const fm = require(`../../../utils/localization`);

const registration = (api) => [
  body(`email`)
    .isEmail()
    .withMessage(fm(`INVALID_EMAIL`))
    .custom(async (email) => {
      const data = await api.users.findByEmail(email);
      if (data) {
        throw new Error(fm(`USER_WITH_EMAIL_EXISTS`, {email}));
      }
    }),
  body(`firstName`)
    .trim()
    .exists()
    .matches(VALID_NAME_REGEXP)
    .withMessage(fm(`FIRSTNAME_ONLY_LETTERS`)),
  body(`lastName`)
    .trim()
    .exists()
    .matches(VALID_NAME_REGEXP)
    .withMessage(fm(`LASTNAME_ONLY_LETTERS`)),
  body(`password`)
    .trim()
    .isLength({min: PASSWORD_MIN_LETTERS})
    .withMessage(fm(`PASSWORD_MIN_LETTERS`)),
  body(`passwordConfirmation`)
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        return false;
      }
      return true;
    })
    .withMessage(fm(`PASSWORD_DONT_MATCH`)),
  body(`file`)
    .custom((file) => {
      if (!file) {
        return true;
      }
      const ext = path.extname(file.originalname);
      return ValidImgExtensions.includes(ext);
    })
    .withMessage(fm(`ONLY_FILES_SUPPORTED`)),
];

const login = () => [
  body(`email`)
    .isEmail()
    .withMessage(fm(`INVALID_EMAIL`)),
  body(`password`)
    .trim()
    .isLength({min: PASSWORD_MIN_LETTERS})
    .withMessage(fm(`PASSWORD_MIN_LETTERS`)),
];

const userValidation = {
  registration,
  login,
};

module.exports = userValidation;
