const bcrypt = require('bcrypt');

async function hassPassword(textPw) {
  const salt = await bcrypt.genSalt(+process.env.SALT);
  const hassPw = await bcrypt.hash(textPw, salt);
  return hassPw;
}

async function checkPassword(textPw, hassPw) {
  return await bcrypt.compare(textPw, hassPw);
}

module.exports = { hassPassword, checkPassword };
