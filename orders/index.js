const db = require('../lib/dbConnection');

module.exports = function () {
  const ordersRepository = require('./ordersRepository')(db);
  const ordersController = require('./ordersController')(ordersRepository);

  return require('./ordersRoutes')(ordersController);
}