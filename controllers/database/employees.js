const Employees = require('./models/employees');

// Logger
const logger = require('../utils/logger');

// Error creator
const ErrorCreator = require('../middlewares/errorHandler/errorCreator');

async function getAllEmployees() {
  try {
    const employees = await Employees.query().withGraphFetched('superior');
    return employees;
  } catch (error) {
    logger.error('Error @getAllEmployees', error);
    throw new ErrorCreator('Internal Server Error', 500);
  }
}

async function getEmployeeByNumber(employeeNumber) {
  try {
    const employee = await Employees.query().findById(employeeNumber).withGraphFetched('superior');
    if (!employee) throw new ErrorCreator('Invalid employeeNumber', 400);
    return employee;
  } catch (error) {
    logger.error('Error @getEmployeeByNumber', error);
    if (error.statusCode === 400) throw error;
    throw new ErrorCreator('Internal Server Error', 500);
  }
}

async function createEmployee(data) {
  try {
    const employee = await Employees.query().insertGraphAndFetch(data).withGraphFetched('superior');
    return employee;
  } catch (error) {
    logger.error('Error @createEmployee', error);
    throw new ErrorCreator('Internal Server Error', 500);
  }
}

async function updateEmployee(employeeNumber, data) {
  try {
    const result = await Employees.query().patch(data).where('employeeNumber', employeeNumber);
    if (!result) throw new ErrorCreator('Invalid employeeNumber', 400);
    const employee = await Employees.query().findById(data.employeeNumber).withGraphFetched('superior');
    return employee;
  } catch (error) {
    logger.error('Error @updateEmployee', error);
    if (error.statusCode === 400) throw error;
    throw new ErrorCreator('Internal Server Error', 500);
  }
}

async function deleteEmployee(employeeNumber) {
  try {
    const result = await Employees.query().deleteById(employeeNumber);
    if (!result) throw new ErrorCreator('Invalid employeeNumber', 400);
    return { status: 'success', message: `Successfully delete employee #${employeeNumber}` };
  } catch (error) {
    logger.error(error);
    if (error.statusCode === 400) throw error;
    throw new ErrorCreator('Internal Server Error', 500);
  }
}

module.exports = { getAllEmployees, getEmployeeByNumber, createEmployee, updateEmployee, deleteEmployee };
