const db = require('../lib/dbConnection');

module.exports = function () {
  const productsRepository = require('./productsRepository')(db);
  const productsController = require('./productsController')(productsRepository);

  return require('./productsRoutes')(productsController);
}