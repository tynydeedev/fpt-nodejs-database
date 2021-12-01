const Customers = require('./models/customers');
const Employees = require('./models/employees');

// Logger
const logger = require('../utils/logger');

// Error creator
const ErrorCreator = require('../middlewares/errorHandler/errorCreator');
const { all } = require('../../routers/employees');

async function getAllCustomers(employeeNumber) {
  try {
    if (!employeeNumber) {
      const customers = await Customers.query().withGraphFetched('salesRep');
      return customers;
    }

    const customers = await Customers.query()
      .whereIn(
        'salesRepEmployeeNumber',
        Employees.query()
          .select('employeeNumber')
          .where('reportsTo', employeeNumber)
          .orWhere('employeeNumber', employeeNumber)
      )
      .withGraphFetched('salesRep');

    return customers;
  } catch (error) {
    logger.error('Error @getAllCustomers', error);
    throw new ErrorCreator('Internal Server Error', 500);
  }
}

async function getCustomerByNumber(customerNumber, employeeNumber) {
  try {
    if (!employeeNumber) {
      const customer = await Customers.query().findById(customerNumber).withGraphFetched('salesRep');
      console.log(customer);
      if (!customer) throw new ErrorCreator('Invalid customerNumber', 400);
      return customer;
    }

    const customer = await Customers.query()
      .findById(customerNumber)
      .whereIn(
        'salesRepEmployeeNumber',
        Employees.query()
          .select('employeeNumber')
          .where('reportsTo', employeeNumber)
          .orWhere('employeeNumber', employeeNumber)
      )
      .withGraphFetched('salesRep');

    if (!customer) throw new ErrorCreator('Forbidden', 403);

    return customer;
  } catch (error) {
    logger.error('Error @getCustomerByNumber', error);
    if ([400, 403].includes(error.statusCode)) throw error;
    throw new ErrorCreator('Internal Server Error', 500);
  }
}

async function createCustomer(data, employeeNumber) {
  try {
    if (!employeeNumber) {
      const customer = await Customers.query().insertAndFetch(data).withGraphFetched('salesRep');
      return customer;
    }

    const allowedSalesRep = await Employees.query()
      .select('employeeNumber')
      .where('employeeNumber', employeeNumber)
      .orWhere('reportsTo', employeeNumber);

    const listOfSalesRep = allowedSalesRep.map(sale => sale.employeeNumber);

    if (listOfSalesRep.includes(data.salesRepEmployeeNumber)) {
      const customer = await Customers.query().insertAndFetch(data).withGraphFetched('salesRep');
      return customer;
    }

    throw new ErrorCreator('Forbidden', 403);
  } catch (error) {
    logger.error('Error @createCustomer', error);
    if (error.statusCode === 403) throw error;
    throw new ErrorCreator('Internal Server Error', 500);
  }
}

async function updateCustomer(customerNumber, data, employeeNumber) {
  try {
    if (!employeeNumber) {
      const result = await Customers.query().patch(data).where('customerNumber', customerNumber);
      if (!result) throw new ErrorCreator('Invalid customerNumber', 400);
      const customer = await Customers.query().findById(data.customerNumber).withGraphFetched('salesRep');
      return customer;
    }

    const target = await Customers.query().findById(customerNumber);

    const allowedSalesRep = await Employees.query()
      .select('employeeNumber')
      .where('employeeNumber', employeeNumber)
      .orWhere('reportsTo', employeeNumber);

    const listOfSalesRep = allowedSalesRep.map(sale => sale.employeeNumber);

    if (listOfSalesRep.includes(target.salesRepEmployeeNumber)) {
      const result = await Customers.query().patch(data).where('customerNumber', customerNumber);
      if (!result) throw new ErrorCreator('Invalid customerNumber', 400);
      const customer = await Customers.query().findById(data.customerNumber).withGraphFetched('salesRep');
      return customer;
    }

    throw new ErrorCreator('Forbidden', 403);
  } catch (error) {
    logger.error('Error @updateCustomer', error);
    if ([400, 403].includes(error.statusCode)) throw error;
    throw new ErrorCreator('Internal Server Error', 500);
  }
}

async function deleteCustomer(customerNumber, employeeNumber) {
  try {
    if (!employeeNumber) {
      const result = await Customers.query().deleteById(customerNumber);
      if (!result) throw new ErrorCreator('Invalid customerNumber', 400);
      return { status: 'success', message: `Successfully delete customer #${customerNumber}` };
    }

    const target = await Customers.query().findById(customerNumber);

    if (!target) throw new ErrorCreator('Invalid customerNumber', 400);

    const allowedSalesRep = await Employees.query()
      .select('employeeNumber')
      .where('employeeNumber', employeeNumber)
      .orWhere('reportsTo', employeeNumber);

    const listOfSalesRep = allowedSalesRep.map(sale => sale.employeeNumber);

    if (listOfSalesRep.includes(target.salesRepEmployeeNumber)) {
      const result = await Customers.query().deleteById(customerNumber);
      if (!result) throw new ErrorCreator('Invalid customerNumber', 400);
      return { status: 'success', message: `Successfully delete customer #${customerNumber}` };
    }

    throw new ErrorCreator('Forbidden', 403);
  } catch (error) {
    logger.error('Error @deleteCustomer', error);
    if ([400, 403].includes(error.statusCode)) throw error;
    throw new ErrorCreator('Internal Server Error', 500);
  }
}

module.exports = { getAllCustomers, getCustomerByNumber, createCustomer, updateCustomer, deleteCustomer };
