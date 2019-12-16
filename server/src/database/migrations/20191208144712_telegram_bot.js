
exports.up = knex => {
  return knex.schema.createTable('telegram_bot', table => {
    table.string('chat_id').unique()
  })
}

exports.down = knex => {
  return knex.schema.dropTable('telegram_bot')
}
