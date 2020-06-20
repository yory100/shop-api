const url = require('url');

function skip (options) {
  const middleware = this;
  
  function result(req, res, next) {
    const parsed_url = url.parse(req.url, true);
    const token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];

    let skip = false;
    const paths = options.path;

    if (paths) {
        skip = skip || paths.some(function (p) {
        const methods = p.methods;
        return isUrlMatch(p, parsed_url.pathname) && isMethodMatch(methods, req.method) && isUser(p, token);
      });
    }

    if (skip) {
      return next();
    }

    middleware(req, res, next);
  }

  return result;
}

function isUrlMatch (p, url) {
  let ret = (typeof p === 'string' && p === url);

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

module.exports = skip;