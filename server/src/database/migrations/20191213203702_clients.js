
exports.up = function(knex) {
  return knex.schema.createTable('clients', table => {
    table.increments('id')
    table.string('name')
    table.string('url')
    table.string('clientKey')
    table.string('clientSecret')
    table.decimal('processingFee', 8, 4).defaultTo(0)
    table.boolean('enabled').defaultTo(true)
    table.boolean('archived').defaultTo(false)
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('clients');
};
