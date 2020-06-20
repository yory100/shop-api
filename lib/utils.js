exports.mapProductsVat = function (products, vat) {
  return products.map(p => {
            p.price *= vat;
            return p;
          })
}

exports.placeholdersProductsUpdate = function (columns) {
  return columns.map((col, i) => {
            return i !== (columns.length - 1) ? `${col}=?,` : `${col}=?`;
          }).join(" ");
}

exports.fromatOrdersList = function (row) {
  const output = {};
  if (row) {
    row.map(order => {
      output[order.id] 
        ? output[order.id].products.push(order.products) 
        : output[order.id] = { ...order, products: [order.products] }
    });
  }

  return Object.values(output);
}

exports.placeholdersOrdersCreate = function (products) {
  return products.map((p, i) => {
            return i !== (products.length - 1) ? '(?, ?),' : '(?, ?)';
          }).join(" ");
}

exports.insertOrdersHasProducts = function (products, orderId) {
  return products.map(p => [orderId, p] ).flat();
}