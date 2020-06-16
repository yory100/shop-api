const router = require('express').Router();


module.exports = (Controller) => {
  router.get('/', Controller.getList);
  // router.post('/', Controller.create);
  // router.get('/:id', Controller.getById);
  // router.put('/:id', Controller.update);

    return router;
};
