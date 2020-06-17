const path = require('path');

const config = {
  port: 1950,
  apiPrefix: '/apiv1',
  database: path.resolve('db', 'sbtech.db'),
};
module.exports = config;