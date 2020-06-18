module.exports.dbSchema = `
CREATE TABLE IF NOT EXISTS users (
  id integer not null primary key,
  username text not null unique,
  hash text not null,
  country_code text
);

CREATE TABLE IF NOT EXISTS products (
  id integer not null primary key,
  name text not null,
  category text not null,
  price real default 0.0
);
  
CREATE TABLE IF NOT EXISTS orders (
  id integer not null primary key,
  date text default (datetime('now')),
  status_id integer not null,
  FOREIGN KEY (status_id) REFERENCES orders_status (id) 
      ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS orders_has_products (
  order_id integer not null,
  product_id integer not null,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders (id) 
      ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (product_id) REFERENCES products (id) 
      ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS orders_status (
  id integer not null primary key,
  status text not null unique
);

INSERT OR IGNORE INTO orders_status (id, status)
VALUES(1,'Pending');

INSERT OR IGNORE INTO orders_status (id, status)
VALUES(2,'Processing');

INSERT OR IGNORE INTO orders_status (id, status)
VALUES(3,'Delivered');

INSERT OR IGNORE INTO orders_status (id, status)
VALUES(4, 'Cancelled');`