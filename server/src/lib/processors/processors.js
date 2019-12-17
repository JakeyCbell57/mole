const database = require('../../database');
const crypto = require('crypto');

const table = 'processors';
const typesTable = 'processor_types';

function getById(id) {
  return database.select().from(table).where('id', id).first();
}

function save(name, url, processorType) {
  const apiKey = hex(24);
  return database.insert({ name, url, apiKey, processorType }).into(table);
}

function setEnabled(id, enabled) {
  return database(table).update({ enabled }).where('id', id);
}

function getAll() {
  return database
    .select([`${table}.*`, `${typesTable}.name as type`])
    .from(table)
    .leftJoin(typesTable, `${typesTable}.id`, `${table}.processorType`)
    .where('archived', false);
}

function getAllEnabled() {
  return database.select().from(table).where('enabled', true);
}

function remove(id) {
  return database(table).where('id', id).update('archived', true);
}

function update(id, data) {
  return database(table).where('id', id).update(data);
}

function getProcessorTypes() {
  return database.select().from(typesTable);
}

/**
 * Used by load balancer to get balance of enabled processors.
 * 
 * @param {number} lookback amount of time to lookback in milliseconds
 */
async function sortedBalancesPerProcessorSince(lookback) {
  const fromTime = Date.now() - lookback;
  const result = await database.raw(`
    SELECT 
      processors.id,
      SUM(orders."orderTotal") as balance
    FROM processors
    JOIN orders
      ON orders."processorId" = processors.id
      AND orders."createdAt" > '${fromTime}'
    WHERE processors.enabled = true and processors.archived = false
    GROUP BY processors.id
    ORDER BY balance ASC;    
  `);

  return result && result.rows;
}

async function sortedBalancesPerProcessorInRange(start, end) {
  const query = end ? `between '${start}' and '${end}'` : `> '${start}'`;

  const result = await database.raw(`
    SELECT 
      processors.id,
      processors.name,
      processor_types.name as type,
      SUM(orders."orderTotal") as balance,
      SUM(orders."processingFee") as fees,
      count(orders.*) as transactions
    FROM processors
    JOIN orders
      ON orders."processorId" = processors.id
      AND orders."createdAt" ${query}
    JOIN processor_types
      ON processor_types.id = processors."processorType"
    GROUP BY processors.id, processor_types.name
    ORDER BY balance DESC;
  `);

  return result && result.rows;
}

function hex(amount) {
  return crypto.randomBytes(amount).toString('hex');
}

module.exports = {
  getById,
  save,
  getAll,
  getAllEnabled,
  update,
  remove,
  setEnabled,
  getProcessorTypes,
  sortedBalancesPerProcessorSince,
  sortedBalancesPerProcessorInRange
};
