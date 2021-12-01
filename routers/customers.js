// Init router
const express = require('express');
const router = express.Router();

// Authorization middleware
const autho = require('../controllers/middlewares/authorization');

// Validation middleware
const { validateCreateCustomer, validatePutCustomer } = require('../controllers/middlewares/validators/customers');

// Database functions
const {
  getAllCustomers,
  getCustomerByNumber,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/database/customers');

// Other utils
const ErrorCreator = require('../controllers/middlewares/errorHandler/errorCreator');
const { errorWrapper } = require('../controllers/middlewares/errorHandler/errorHandler');
const logger = require('../controllers/utils/logger');

router
  .route('/')
  .get(
    autho([1, 2, 3, 4]),
    errorWrapper(async (req, res, next) => {
      const tokenData = res.locals.tokenData;

      if ([1, 2].includes(tokenData.role)) {
        const result = await getAllCustomers();
        return res.send(result);
      }

      const result = await getAllCustomers(tokenData.employeeNumber);
      return res.send(result);
    })
  )
  .post(
    autho([1, 2, 3, 4]),
    validateCreateCustomer,
    errorWrapper(async (req, res, next) => {
      const tokenData = res.locals.tokenData;

      if ([1, 2].includes(tokenData.role)) {
        const result = await createCustomer(req.body);
        return res.send(result);
      }

      const result = await createCustomer(req.body, tokenData.employeeNumber);
      return res.send(result);
    })
  );

// Validation the parameter
router.use('/:customerNumber', (req, res, next) => {
  if (/[^0-9]/.test(req.params.customerNumber)) {
    logger.error('Invalid customerNumber @/customers/:customerNumber');
    throw new ErrorCreator('Invalid customerNumber', 400);
  }
  next();
});

router
  .route('/:customerNumber')
  .get(
    autho([1, 2, 3, 4]),
    errorWrapper(async (req, res, next) => {
      const tokenData = res.locals.tokenData;
      const customerNumber = +req.params.customerNumber;

      if ([1, 2].includes(tokenData.role)) {
        const customer = await getCustomerByNumber(customerNumber);
        return res.send(customer);
      }

      const customer = await getCustomerByNumber(customerNumber, tokenData.employeeNumber);
      return res.send(customer);
    })
  )
  .put(
    autho([1, 2, 3]),
    validatePutCustomer,
    errorWrapper(async (req, res, next) => {
      const tokenData = res.locals.tokenData;
      const customerNumber = +req.params.customerNumber;

      if ([1, 2].includes(tokenData.role)) {
        const customer = await updateCustomer(customerNumber, req.body);
        return res.send(customer);
      }

      const customer = await updateCustomer(customerNumber, req.body, tokenData.employeeNumber);
      return res.send(customer);
    })
  )
  .delete(
    autho([1, 2, 3]),
    errorWrapper(async (req, res, next) => {
      const tokenData = res.locals.tokenData;
      const customerNumber = +req.params.customerNumber;

      if ([1, 2].includes(tokenData.role)) {
        const result = await deleteCustomer(customerNumber);
        return res.send(result);
      }

      const result = await deleteCustomer(customerNumber, tokenData.employeeNumber);
      return res.send(result);
    })
  );

module.exports = router;
