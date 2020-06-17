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
      const { name, category, price } = req.body;

      if (!name || !category)
        catchError(res, "Product name and category are mandatory");

      const data = {
        name: name,
        category: category,
        price: price,
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
      const { name, category, price } = req.body;

      const data = {
        name: name,
        category: category,
        price: price,
      };

      await productsRepository.update(data, productId);

      res.json({
        success: true
      });

    } catch (error) {
      catchError(res, error);
    }
  }

  async function remove(req, res) {
    try {
      const productId = req.params.id;

      await productsRepository.remove(productId);

      res.status(204).end();
    } catch (error) {
      catchError(res, error);
    }
  }

  return {
    getList,
    create,
    update,
    remove
  };
  
}