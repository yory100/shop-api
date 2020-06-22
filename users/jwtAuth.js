const url = require('url');
const db = require('../lib/dbConnection');
const config = require('../config');
const usersRepository = require('./usersRepository')(db);
const jwt = require('jwt-simple');

module.exports = function () {

  const jwtAuth = function (req, res, next) {
    const parsed_url = url.parse(req.url, true);
    const token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];

    if (token) {
      try {

        const decoded = jwt.decode(token, config.jwtSecret);
  
        if (decoded.exp <= Date.now()) {
          res.status(400).end('Access token has expired')
        }
        
        usersRepository.findUser(decoded.id)
          .then(function (user) {
            if(user)
              req.user = decoded;
            return next();
          })
          .catch(error => catchError(res, "Not authorized", { code: 401 }));

      } catch (error) {
        catchError(res, "Not authorized", { code: 401 });
      }
    } else {
      res.status(401).json({
        success: false,
        msg: 'No token provided'
      });
    }
  }

  jwtAuth.skip = require('../middleware/skip');

  return jwtAuth;
}

