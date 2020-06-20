const utils = require('../lib/utils');

module.exports = function productsRepository(db)  {

  const selectOrdersQuery = `
    SELECT orders.id, orders.date, 
           orders_status.status AS status, 
           orders_has_products.product_id AS products
    FROM orders
    LEFT JOIN orders_status ON orders.status_id = orders_status.id
    LEFT JOIN orders_has_products ON orders.id = orders_has_products.order_id
    ORDER BY  orders.id;
  `;

  function getList() {
    return new Promise((resolve, reject) => {
      db.all(selectOrdersQuery, [], function (err, row) {
        if (err) reject(err);
        
        resolve(utils.fromatOrdersList(row));
      })
    })
  }

  function create(data) {
    const selectStatusIDQuery = `
      SELECT id FROM orders_status
      WHERE status LIKE '%${data.status}%';
    `;

    const insertOrdersQuery = `
      INSERT INTO orders (status_id)
      VALUES (?);
    `;

    const updateValues = utils.placeholdersOrdersCreate(data.products)

    const insertOrdersHasProductsQuery = `
      INSERT INTO orders_has_products (order_id, product_id)
      VALUES ${updateValues}
    `;

    return new Promise((resolve, reject) => {
      // Select status id 
      db.get(selectStatusIDQuery, [], function(err, row) {
        if (err) reject(err); 

        let orderID = {};
        row ? orderID = row.id : reject('No such status.');
        // Create order
        db.run(insertOrdersQuery, [orderID], function (err) {
          if (err) reject(err);

          const productsInOrder = utils.insertOrdersHasProducts(data.products, this.lastID)
          // Link created order with products
          db.run(insertOrdersHasProductsQuery, productsInOrder, function(err) {
            if (err) reject(err);
  
            resolve(this.changes);
          });
        })
      });
    });
  }

  function update(status, orderId) {
    const selectStatusIDQuery = `
      SELECT id FROM orders_status
      WHERE status LIKE '%${status}%';
    `;

    const query = `
      UPDATE orders
      SET status_id = (?)
      WHERE id = (?);
    `;
 
    return new Promise((resolve, reject) => {
      db.get(selectStatusIDQuery, [], function(err, row) {
        if (err) reject(err);

        !row && reject('No such status.');

        db.run(query, [row.id, orderId], function (err) {
          if (err) reject(err);
          
          resolve();
        })
      });
    });
  }

  return {
    getList,
    create,
    update,
  }
}