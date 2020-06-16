'use strict'

module.exports = function productsController(productsRepository) {

  function getList(req, res) {
    try {
      res.json({
        payload: 'hello world'
      })
    } catch (error) {
      catchError(res, err);
    }
  }

  return {
    getList
  };
  
}