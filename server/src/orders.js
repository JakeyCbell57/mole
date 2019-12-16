const database = require('./database/database');

function storeIfNotExist(orderData) {

  const order = {
    order_id: orderData.id,
    order_created_date: orderData.date_created,
    order_total: orderData.total
  };

  const insert = database.insert(order).into('orders').toString();
  const conflict = database.raw(' ON CONFLICT ("order_id") DO NOTHING').toString();
  const query = (insert + conflict).replace(/\?/g, '\\?');

  return database.raw(query);
}

module.exports = {
  storeIfNotExist
};
