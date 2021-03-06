exports.up = async function (knex) {

  await knex.schema.createTable('processor_types', table => {
    table.increments('id')
    table.string('name')
    table.string('codeName')
  })

  await knex.schema.createTable('processors', table => {
    table.increments('id')
    table.string('name')
    table.string('url')
    table.string('apiKey')
    table.boolean('enabled').defaultTo(true)
    table.boolean('healthy').defaultTo(true)
    table.integer('processorType').unsigned().references('id').inTable('processor_types')
    table.boolean('archived').defaultTo(false)
  })
};

exports.down = async function (knex) {
  await knex.schema.dropTable('processors')
  await knex.schema.dropTable('processor_types')
};
