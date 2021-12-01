const Joi = require('joi');
const { celebrate } = require('celebrate');

const userSchema = {
  username: Joi.string().min(3).max(20).required(),
  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(/(?=.*[0-9])(?=.*[!@#$%^&*?-_\/><;:'",|\\\.])/)
    .required(),
  employeeNumber: Joi.number().integer().positive().required(),
};

const validateRegisterUser = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys({}),
    body: Joi.object().keys(userSchema),
  },
  {
    abortEarly: false,
    convert: false,
    escapeHTML: true,
  }
);

module.exports = { validateRegisterUser };
