const { Model } = require('objection');
const Employees = require('./employees');

module.exports = class Role extends Model {
  static get tableName() {
    return 'role';
  }

  static relationMappings = {
    relation: Model.HasManyRelation,
    modelClass: Employees,
    join: {
      from: 'role.id',
      to: 'employees.role',
    },
  };
};
