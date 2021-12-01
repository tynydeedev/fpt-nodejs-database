const Joi = require('joi');
const { celebrate } = require('celebrate');
const { customerSchema } = require('./customers');

const titleList = ['President', 'Manager', 'Leader', 'Staff'];

const employeeSchema = {
  employeeNumber: Joi.number().integer().positive().required(),
  lastName: Joi.string().min(3).max(50).trim().invalid('9999').required(),
  firstName: Joi.string().min(3).max(50).trim().required(),
  extension: Joi.string().max(50).trim().required(),
  email: Joi.string().min(10).max(100).email().trim().required(),
  officeCode: Joi.number().valid(1, 2, 3, 4, 5, 6, 7),
  reportsTo: Joi.number().integer().positive().allow(null),
  jobTitle: Joi.string()
    .valid(...titleList)
    .required(),
  role: Joi.number().integer().valid(1, 2, 3, 4).required(),
  customers: Joi.array().items(Joi.object(customerSchema)),
};

const validateCreateEmployee = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys({}),
    body: Joi.object().keys(employeeSchema),
  },
  {
    abortEarly: false,
    convert: false,
    escapeHTML: true,
  }
);

const validatePutEmployee = celebrate(
  {
    query: Joi.object().keys({}),
    body: Joi.object().keys(employeeSchema),
  },
  {
    abortEarly: false,
    convert: false,
    escapeHTML: true,
  }
);

module.exports = { validateCreateEmployee, validatePutEmployee };
