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
      db.run(insertProductQuery, params, (err) => {
        if (err) reject(err);

        resolve();
      })
    });
  }
 
  function update(data, id) {
    const columns = Object.keys(data).filter(c => data[c]);
    const params = Object.values(data).filter(p => p);

    const updateColumns = columns.map((col, i) => {
      return i !== (columns.length - 1) ? `${col}=?,` : `${col}=?`;
    }).join(" ");

    console.log(updateColumns)

    const query = `
      UPDATE products
      SET ${updateColumns}
      WHERE id = ${id};
    `;
 
    return new Promise((resolve, reject) => {
      db.run(query, params, (err) => {
        if (err) reject(err);

        resolve();
      })
    });
  }

  function remove(id) {
    const query = `DELETE FROM products WHERE id=?`

    return new Promise((resolve, reject) => {
      db.run(query, id, (err) => {
        if (err) reject(err);

        resolve();
      })
    });
  }

  return {
    getList,
    create,
    update,
    remove
  }
  
}