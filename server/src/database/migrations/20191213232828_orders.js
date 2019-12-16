
exports.up = function(knex) {
  return knex.schema.createTable('orders', table => {
    table.increments('id')
    table.string('orderId')
    table.decimal('orderTotal', 16, 2)
    table.decimal('processingFee', 16, 2)
    table.integer('clientId')
    table.integer('processorId')
    table.string('createdAt')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders')
};
