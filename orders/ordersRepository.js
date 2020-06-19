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

        const output = {};
        row.map(order => {
          output[order.id] 
            ? output[order.id].products.push(order.products) 
            : output[order.id] = { ...order, products: [order.products] }
        });
        
        resolve(Object.values(output));
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

    const updateValues = data.products.map((p, i) => {
      return i !== (data.products.length - 1) ? '(?, ?),' : '(?, ?)';
    }).join(" ");

    const insertOrdersHasProductsQuery = `
      INSERT INTO orders_has_products (order_id, product_id)
      VALUES ${updateValues}
    `;

    return new Promise((resolve, reject) => {
      // Select status id 
      db.get(selectStatusIDQuery, [], function(err, row) {
        if (err) reject(err); 

        let values = {};
        row ? values.orderID = row.id : reject('No such status.');
        // Create order
        db.run(insertOrdersQuery, [values.orderID], function (err) {
          if (err) reject(err);

          values.productsInOrder = data.products
                                    .map(p => [this.lastID, p])
                                    .flat();
          // Link created order with products
          db.run(insertOrdersHasProductsQuery, values.productsInOrder, function(err) {
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