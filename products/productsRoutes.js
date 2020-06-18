const router = require('express').Router();

module.exports = (Controller) => {
  router.get('/', Controller.getList);
  router.post('/', Controller.create);
  router.put('/:id', Controller.update);
  router.delete('/:id', Controller.remove);

    return router;
};
