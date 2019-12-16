
exports.seed = async function(knex) {
  await knex.raw('ALTER sequence "processor_types_id_seq" restart with 2;');
  await knex('processor_types').insert([
    { id: 1, name: 'Stripe' , codeName: 'stripe', parameters: ['apiKey'] },
  ]);
};

