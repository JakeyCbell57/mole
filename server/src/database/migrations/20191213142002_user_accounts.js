const { users } = require('../../lib/users');

exports.up = async function(knex) {
  await knex.schema.createTable('user_accounts', table => {
    table.increments('userId')
    table.string('username')
    table.string('password')
    table.string('lastLogin')
  });

  await users.save('admin', 'admin', knex);
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_accounts');
};
