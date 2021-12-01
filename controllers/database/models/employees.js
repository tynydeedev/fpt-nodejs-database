const { Model } = require('objection');
const Customers = require('./customers');
const Role = require('./role');

module.exports = class Employees extends Model {
  static get tableName() {
    return 'employees';
  }

  static get idColumn() {
    return 'employeeNumber';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['employeeNumber', 'lastName', 'firstName', 'extension', 'email', 'officeCode', 'jobTitle', 'role'],
      properties: {
        employeeNumber: { type: 'integer', minimum: 1 },
        lastName: { type: 'string', minLength: 3, maxLength: 50 },
        firstName: { type: 'string', minLength: 3, maxLength: 50 },
        extension: { type: 'string', maxLength: 50 },
        email: { type: 'string', minLength: 10, maxLength: 100 },
        officeCode: { enum: [1, 2, 3, 4, 5, 6, 7] },
        reportsTo: { type: ['integer', 'null'], minimum: 1 },
        jobTitle: { type: 'string' },
        role: { enum: [1, 2, 3, 4] },
      },
    };
  }

  static relationMappings = {
    customers: {
      relation: Model.HasManyRelation,
      modelClass: Customers,
      join: {
        from: 'employees.employeeNumber',
        to: 'customers.salesRepEmployeeNumber',
      },
    },
    privileges: {
      relation: Model.BelongsToOneRelation,
      modelClass: Role,
      join: {
        from: 'employees.role',
        to: 'role.id',
      },
    },
    superior: {
      relation: Model.BelongsToOneRelation,
      modelClass: Employees,
      join: {
        from: 'employees.reportsTo',
        to: 'employees.employeeNumber',
      },
    },
  };
};
