const database = require('../../database');
const bcrypt = require('bcrypt');

const table = 'user_accounts';

function getByUsername(username) {
  return database.select().from(table).where('username', username).first();
}

function getById(userId) {
  return database.select().from(table).where('userId', userId).first();
}

function save(username, password, knex) {
  const db = knex || database; // used for inserting a seed user during initial migration
  const hash = bcrypt.hashSync(password, 10);

  return db.insert({ username, password: hash }).into(table);
}

function getAll() {
  return database.select(['userId', 'username', 'lastLogin']).from(table)
}

function remove(userId) {
  return database(table).where('userId', userId).del();
}

function updateLastLogin(userId) {
  return database(table).update({ lastLogin: new Date().valueOf() }).where('userId', userId);
}

module.exports = {
  getByUsername,
  getById,
  save,
  getAll,
  remove,
  updateLastLogin
};
