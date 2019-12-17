exports.seed = async function (knex) {
  await knex('clients').del()
  await knex.raw('ALTER sequence "clients_id_seq" restart with 5;');
  await knex('clients').insert([
    { id: 1, name: 'Client 1', clientKey: '9dc0d129-e36b81cb7754e61663cc508221a20d1a6e9d72b85f7d96ff', clientSecret: '38612790263db835b90021a2464f205abdd0d75c13335c83' },
    { id: 2, name: 'Client 2', clientKey: '9dc0d129-e36b81cb7754e61663cc508221a20d1a6e9d72b85f7d96ff', clientSecret: '38612790263db835b90021a2464f205abdd0d75c13335c83' },
    { id: 3, name: 'Client 3', clientKey: '9dc0d129-e36b81cb7754e61663cc508221a20d1a6e9d72b85f7d96ff', clientSecret: '38612790263db835b90021a2464f205abdd0d75c13335c83' },
    { id: 4, name: 'Client 4', clientKey: '9dc0d129-e36b81cb7754e61663cc508221a20d1a6e9d72b85f7d96ff', clientSecret: '38612790263db835b90021a2464f205abdd0d75c13335c83' },
  ]);

  await knex('processor_types').del()
  await knex.raw('ALTER sequence "processor_types_id_seq" restart with 2;');
  await knex('processor_types').insert([
    { id: 1, name: 'Stripe', codeName: 'stripe', parameters: ['apiKey'] },
  ]);

  await knex('processors').del()
  await knex.raw('ALTER sequence "processors_id_seq" restart with 5;');
  await knex('processors').insert([
    { id: 1, name: 'Processor Placeholder 1', url: 'domain.com', apiKey: '38612790263db835b90021a2464f205abdd0d75c13335c83', processorType: 1 },
    { id: 2, name: 'Processor Placeholder 2', url: 'domain.com', apiKey: '38612790263db835b90021a2464f205abdd0d75c13335c83', processorType: 1 },
    { id: 3, name: 'Processor Placeholder 3', url: 'domain.com', apiKey: '38612790263db835b90021a2464f205abdd0d75c13335c83', processorType: 1 },
    { id: 4, name: 'Processor Placeholder 4', url: 'domain.com', apiKey: '38612790263db835b90021a2464f205abdd0d75c13335c83', processorType: 1 },
  ]);

};
