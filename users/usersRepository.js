const bcrypt = require('bcryptjs');

module.exports = function usersRepository(db) {

  function login(username, password) {
    const query = `
      SELECT id, username, hash, country_code 
      FROM users
      WHERE username=?;
    `;

    return new Promise((resolve, reject) => {
      db.get(query, [username], function(err, row) {
        if(err) reject(err);


        if(bcrypt.compareSync(password, row.hash)) {
          resolve({
            id: row.id,
            country: row.country_code
          })
        }

        reject('Wrong username or password');
      })
    })
  }

  function findUser(id) {
    const query = `
      SELECT id, username, country_code 
      FROM users
      WHERE id=?;
  `;

    return new Promise((resolve, reject) => {
      db.get(query, [id], function(err, row) {
        if(err) reject(err);
        if(!row) reject();

        resolve(row);
      })
    })
  }

  return {
    login,
    findUser
  }
  
}