const router = require('express').Router();
const config = require('../config');

module.exports = function (app) {

  app.use('/', router)

  const products = require('../products')();
  router.use(config.apiPrefix + '/products', products);

  const orders = require('../orders')();
  router.use(config.apiPrefix + '/orders', orders);

  return router;
};