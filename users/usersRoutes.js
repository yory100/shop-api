const router = require('express').Router();

module.exports = (Controller) => {
  router.post('/login', Controller.login);

  return router;
};
