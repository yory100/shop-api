module.exports = function ordersController(ordersRepository) {

  async function getList(req, res) {
    try {
      const orders = await ordersRepository.getList();

      res.json({
        payload: orders
      });
      
    } catch (error) {
      catchError(res, error);
    }
  }

  async function create(req, res) {
    try {
      const { status, products } = req.body;

      const data = {
        status,
        products,
      }

      await ordersRepository.create(data);

      
      res.status(201).json({
        success: true
      });


    } catch (error) {
      catchError(res, error);
    }
  }

  async function update(req, res) {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;

      if (!status)
        catchError(res, "Order status is mandatory");

      await ordersRepository.update(status, orderId);

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