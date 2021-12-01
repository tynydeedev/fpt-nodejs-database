const Joi = require('joi');
const { celebrate } = require('celebrate');

const customerSchema = {
  customerNumber: Joi.number().integer().positive().required(),
  customerName: Joi.string().min(5).max(50).trim().required(),
  contactLastName: Joi.string().min(3).max(50).trim().required(),
  contactFirstName: Joi.string().min(3).max(50).trim().required(),
  phone: Joi.string().min(8).max(20).trim().required(),
  addressLine1: Joi.string().min(10).max(50).trim().required(),
  addressLine2: Joi.string().min(10).max(50).trim().allow(null).required(),
  city: Joi.string().min(2).max(50).trim().required(),
  state: Joi.string().min(2).max(50).trim().allow(null).required(),
  postalCode: Joi.string().min(5).max(15).trim().allow(null).required(),
  country: Joi.string().min(2).max(50).trim().required(),
  salesRepEmployeeNumber: Joi.number().integer().positive().allow(null).required(),
  creditLimit: Joi.number().precision(2).positive().less(10000000000).allow(null, Joi.number().integer()).optional(),
};

const validateCreateCustomer = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys({}),
    body: Joi.object().keys(customerSchema),
  },
  {
    abortEarly: false,
    convert: false,
    escapeHTML: true,
  }
);

const validatePutCustomer = celebrate(
  {
    query: Joi.object().keys({}),
    body: Joi.object().keys(customerSchema),
  },
  {
    abortEarly: false,
    convert: false,
    escapeHTML: true,
  }
);

module.exports = { customerSchema, validateCreateCustomer, validatePutCustomer };
