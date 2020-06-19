const db = require('../lib/dbConnection');

module.exports = function () {
  const usersRepository = require('./usersRepository')(db);
  const usersController = require('./usersController')(usersRepository);

  return require('./usersRoutes')(usersController);
}