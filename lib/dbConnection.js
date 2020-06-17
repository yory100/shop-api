
const sqlite = require('sqlite3').verbose();
const config = require('../config');

function connection () {
    db = new sqlite.Database( config.database, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to database.');
    });

    return db;
  };

  module.exports = connection();