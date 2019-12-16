
exports.up = async function(knex) {
  await knex.schema.createTable('load_balancer', table => {
    table.increments('id');
    table.integer('lastIndex').defaultTo(-1)
  })

  await knex.raw('ALTER sequence "user_accounts_userId_seq" restart with 2;');
  await knex.insert({ id: 1 }).into('load_balancer');

};

exports.down = function(knex) {
  return knex.schema.dropTable('load_balancer')
};
