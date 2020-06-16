// const db = require('../lib/dbConnection');

module.exports = function () {
  // const productsRepository = new (require('./productsController'))(db);
  const productsController = new (require('./productsController'))();

  return require('./productsRoutes')(productsController);
}