const { Model } = require('objection');
const Employees = require('./employees');

module.exports = class Users extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'username';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password', 'employeeNumber'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        employeeNumber: { type: 'integer', minimum: 1 },
      },
    };
  }

  static relationMappings = {
    employees: {
      relation: Model.BelongsToOneRelation,
      modelClass: Employees,
      join: {
        from: 'users.employeeNumber',
        to: 'employees.employeeNumber',
      },
    },
  };
};
