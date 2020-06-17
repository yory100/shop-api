'use strict'
module.exports = function productsController(productsRepository) {

  async function getList(req, res) {
    try {
      const products = await productsRepository.getList();

      res.json({
        payload: products
      });

    } catch (error) {
      catchError(res, error);
    }
  }

  async function create(req, res) {
    try {
      const body = req.body;

      if (!body.name || !body.category)
        catchError(res, "Product name and category are mandatory");

      const data = {
        name: body.name,
        category: body.category,
        price: body.price,
      };

      const poduct = await productsRepository.create(data);

      console.log(poduct)

      res.status(201).json({
        success: true
      });

    } catch (error) {
      catchError(res, error);
    }
  }

  async function update(req, res) {
    try {
      const productId = req.params.id;
      const body = req.body;

      const data = {
        name: body.name,
        category: body.category,
        price: body.price,
      };

      await productsRepository.update(data, productId);

      res.json({
        success: true
      });

    } catch (error) {
      catchError(res, error);
    }
  }

  return {
    getList,
    create,
    update
  };
  
}