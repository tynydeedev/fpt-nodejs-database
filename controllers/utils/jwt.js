const jwt = require('jsonwebtoken');

function generateToken(user) {
  const { employeeNumber, officeCode, role } = user.employees;
  return jwt.sign({ employeeNumber, officeCode, role }, process.env.JWTSECRET, { expiresIn: '1h' });
}

module.exports = { generateToken };
