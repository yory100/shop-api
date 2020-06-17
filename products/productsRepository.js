module.exports = function productsRepository(db) {

  const selectProductsQuery = `SELECT * FROM  products`

  function getList() {
    return new Promise((resolve, reject) => {
      db.all(selectProductsQuery, [], (err, row) => {
        if (err) reject(err);
  
        resolve(row);
      })
    })
  }

  const insertProductQuery = `
    INSERT INTO products (name, category, price)
    VALUES (?, ?, ?)
  `;

  function create(data) {
    const params = Object.values(data);
 
    return new Promise((resolve, reject) => {
      db.run(insertProductQuery, params, (err, d) => {
        if (err) reject(err);
       console.log(d)
        resolve();
      })
    });
  }

  
  function update(data, id) {
    const columns = Object.keys(data);
    const params = Object.values(data).filter(d => d !== undefined);

    const query = `
      UPDATE products
      SET name = ?, category = ?, price = ?
      WHERE id = ${id};
    `;
 
    return new Promise((resolve, reject) => {
      db.run(query, params, (err) => {
        if (err) reject(err);
        console.log(query, params)
        resolve();
      })
    });
  }

  return {
    getList,
    create,
    update
  }
  
}