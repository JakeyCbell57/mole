const database = require('../../database');

const table = 'orders';

function getByClientId(clientId, startDate, endDate) {
  return database
    .select(['orders.*', 'clients.name as clientName', 'processors.name as processorName', 'processor_types.name as processorType'])
    .from(table)
    .leftJoin('clients', 'clients.id', 'orders.clientId')
    .leftJoin('processors', 'processors.id', 'orders.processorId')
    .leftJoin('processor_types', 'processor_types.id', 'processors.processorType')
    .whereBetween('createdAt', [ startDate, endDate ])
    .andWhere('orders.clientId', clientId)
    .orderBy('createdAt', 'desc')
}

function getAllInRange(startDate, endDate) {
  return database
    .select(['orders.*', 'clients.name as clientName', 'processors.name as processorName', 'processor_types.name as processorType'])
    .from(table)
    .leftJoin('clients', 'clients.id', 'orders.clientId')
    .leftJoin('processors', 'processors.id', 'orders.processorId')
    .leftJoin('processor_types', 'processor_types.id', 'processors.processorType')
    .whereBetween('createdAt', [ startDate, endDate ])
    .orderBy('createdAt', 'desc')
}

function getAllSince(start) {
  return database
    .select(['orders.*', 'clients.name as clientName', 'processors.name as processorName', 'processor_types.name as processorType'])
    .from(table)
    .leftJoin('clients', 'clients.id', 'orders.clientId')
    .leftJoin('processors', 'processors.id', 'orders.processorId')
    .leftJoin('processor_types', 'processor_types.id', 'processors.processorType')
    .where('createdAt', '>', start)
    .orderBy('createdAt', 'desc')
}

function save(data) {
  return database.insert(data).into(table);
}

module.exports = {
  getByClientId,
  getAllInRange,
  getAllSince,
  save
};
