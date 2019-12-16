require('dotenv').config({ path: '../../.env' })

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 20
    },
    seeds: 'seeds/production'
  }

};
