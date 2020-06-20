const utils = require('../lib/utils');
module.exports = function productsController(productsRepository) {

  async function getList(req, res) {
    try {
      let vat;
      let payload
      const products = await productsRepository.getList();

      if (req.user) {
        vat = await require('../services/vatService')(req.user.cc)
        vat 
          ? payload = utils.mapProductsVat(products, vat)
          : payload = products;
      } else {
        payload = products;
      }

      res.json({
        payload,
        success: true
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

      const poductId = await productsRepository.create(data);

      res.status(201).json({
        poductId,
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