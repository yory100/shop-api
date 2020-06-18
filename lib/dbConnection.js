
const sqlite = require('sqlite3').verbose();
const config = require('../config');
const meta = require('./dbSchema');

function connection () {
    db = new sqlite.Database( config.database, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to database.');

      db.exec('PRAGMA foreign_keys = ON;', function(error)  {
        if (error){
            console.error("Pragma statement didn't work.")
        } else {
            console.log("Foreign Key Enforcement is on.")
        }
      });
    });

    db.exec(meta.dbSchema, function(err){
      if (err) {
          console.log(err)
      }
    });

    return db;
  };

  module.exports = connection();