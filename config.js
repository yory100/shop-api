const path = require('path');

const config = {
  port: 1950,
  apiPrefix: '/apiv1',
  database: path.resolve('db', 'sbtech.db'),
  jwtSecret: 'secret'
};
module.exports = config;