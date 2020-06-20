const utils = require('../lib/utils');

module.exports = function productsRepository(db) {

  const selectProductsQuery = `SELECT * FROM  products`;

  function getList() {
    return new Promise((resolve, reject) => {
      db.all(selectProductsQuery, [], function (err, row) {
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
      db.run(insertProductQuery, params, function (err) {
        if (err) reject(err);
        
        resolve(this.lastID);
      })
    });
  }
 
  function update(data, id) {
    const columns = Object.keys(data).filter(c => data[c]);
    const params = Object.values(data).filter(p => p);

    const updateColumns = utils.placeholdersProductsUpdate(columns);

    const query = `
      UPDATE products
      SET ${updateColumns}
      WHERE id = ${id};
    `;
 
    return new Promise((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) reject(err);
        
        resolve();
      })
    });
  }

  function remove(id) {
    const query = `DELETE FROM products WHERE id=?`

    return new Promise((resolve, reject) => {
      db.run(query, id, function (err) {
        if (err) reject(err);
        console.log(this)
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