const Users = require('./models/users');

// Logger
const logger = require('../utils/logger');

// Authentication
const { hassPassword, checkPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

// Error creator
const ErrorCreator = require('../middlewares/errorHandler/errorCreator');

async function createUser(data) {
  try {
    data.password = await hassPassword(data.password);

    await Users.query().insert(data);

    return {
      status: 'success',
      message: `User '${data.username}' has been created`,
    };
  } catch (error) {
    logger.error('Error @createUser', error);
    throw new ErrorCreator('User creation failure', 500);
  }
}

async function getUserByUsername(username) {
  try {
    const user = await Users.query().findById(username).select(['username', 'password']).withGraphFetched('employees');
    return user;
  } catch (error) {
    logger.error('Error @getUserByUsername', error);
    throw new ErrorCreator(`Cannot find user ${username}`);
  }
}

async function login(data) {
  try {
    const user = await getUserByUsername(data.username);

    if (!user) throw new ErrorCreator('Invalid username', 400);

    const isPwValid = await checkPassword(data.password, user.password);

    if (isPwValid) {
      logger.info(`User ${data.username} has logged in`);
      const token = generateToken(user);
      return { success: true, token };
    }

    throw new ErrorCreator('Invalid password', 400);
  } catch (error) {
    logger.error('Error @login function', error);
    if (error.statusCode === 400) throw error;
    throw new ErrorCreator('Internal Server Error', 500);
  }
}

module.exports = { createUser, login };
