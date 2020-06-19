'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const unless = require('express-unless');
const config = require('./config');
const auth = require('./users/jwtAuth');

const app = module.exports = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('jwtTokenSecret', 'secret');

app.use(auth().unless({
    path: [
      { url: '/apiv1/products', methods: ['GET']  },
      { url: '/apiv1/users/login', methods: ['POST']  }
    ]})
);

require('./routes')(app);

app.get('*', function (req, res, next) {
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.set('jwtTokenSecret', 'add-yours-here');

global.catchError = function catchError(res, err, opt) {
  const errorCode = opt && opt.code ? opt.code : 400;
  res.status(errorCode).json({ success: false, msg: err });
};

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ success: false, msg: err });
});

app.listen(config.port, function () {
  console.log(`App listening on port ${config.port}!`);
});

module.exports = app;
