const url = require('url');
const db = require('../lib/dbConnection');
const config = require('../config');
const usersRepository = require('./usersRepository')(db);
const jwt = require('jwt-simple');

module.exports = function (options) {

  const jwtAuth = function (req, res, next) {
    const parsed_url = url.parse(req.url, true);
    const token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];
    
    if(unless()) {
      return next();
    }

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
      res.status(400).json({
        success: false,
        msg: 'No token provided'
      });
    }

    function unless () {
      let skip = false;
      const paths = options.path;
  
      if (paths) {
          skip = skip || paths.some(function (p) {
          const methods = p.methods;
          return isUrlMatch(p, parsed_url.pathname) && isMethodMatch(methods, req.method) && isUser(p, token);
        });
      }
  
      return skip;
    }
  }
  
  function isUrlMatch (p, url) {
    var ret = (typeof p === 'string' && p === url);
  
    if (p && p.url) {
      ret = isUrlMatch(p.url, url);
    }
    return ret;
  }
  
  function isMethodMatch (methods, m) {
    if (!methods) {
      return true;
    }
  
    return methods.indexOf(m) > -1;
  }

  function isUser(p, token) {
    return p.user && token ? false : true;
  }

  return jwtAuth;
}

