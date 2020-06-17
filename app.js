'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const app = module.exports = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./routes')(app);

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
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(config.port, function () {
  console.log(`App listening on port ${config.port}!`);
});

module.exports = app;
