const { Model } = require('objection');

module.exports = class Customers extends Model {
  static get tableName() {
    return 'customers';
  }

  static get idColumn() {
    return 'customerNumber';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'customerNumber',
        'customerName',
        'contactLastName',
        'contactFirstName',
        'phone',
        'addressLine1',
        'city',
        'country',
        'salesRepEmployeeNumber',
      ],
      properties: {
        customerNumber: { type: 'integer', minimum: 1 },
        customerName: { type: 'string', minLength: 5, maxLength: 50 },
        contactLastName: { type: 'string', minLength: 3, maxLength: 50 },
        contactFirstName: { type: 'string', minLength: 3, maxLength: 50 },
        phone: { type: 'string', minLength: 8, maxLength: 20 },
        addressLine1: { type: 'string', minLength: 10, maxLength: 50 },
        addressLine2: { type: ['string', 'null'], minLength: 10, maxLength: 50 },
        city: { type: 'string', minLength: 2, maxLength: 50 },
        state: { type: ['string', 'null'], minLength: 2, maxLength: 50 },
        postalCode: { type: ['string', 'null'], minLength: 5, maxLength: 15 },
        country: { type: 'string', minLength: 2, maxLength: 50 },
        salesRepEmployeeNumber: { type: ['integer', 'null'], minimum: 1 },
        creditLimit: { type: ['number', 'null'], minimum: 0, maximum: 10000000000 },
      },
    };
  }

  static get relationMappings() {
    const Employees = require('./employees');
    return {
      salesRep: {
        relation: Model.BelongsToOneRelation,
        modelClass: Employees,
        join: {
          from: 'customers.salesRepEmployeeNumber',
          to: 'employees.employeeNumber',
        },
      },
    };
  }
};
