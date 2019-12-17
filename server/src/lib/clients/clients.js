const database = require('../../database');
const crypto = require('crypto');
const fs = require('fs')
const archiver = require('archiver')


const table = 'clients';

function getByClientKey(clientKey) {
  return database.select().from(table).where('clientKey', clientKey).first();
}

function save(name, url, processingFee) {
  const clientKey = generateKey();
  const clientSecret = generateSecret();

  return database.insert({ name, url, processingFee, clientKey, clientSecret }).into(table);
}

function setEnabled(id, enabled) {
  return database(table).update({ enabled }).where('id', id);
}

function getAll() {
  return database.select().from(table).where('archived', false);
}

function remove(id) {
  return database(table).where('id', id).update('archived', true);
}

function update(id, data) {
  return database(table).where('id', id).update(data);
}

function resetCredentials(id) {
  const clientKey = generateKey();
  const clientSecret = generateSecret();

  return database(table).where('id', id).update({ clientKey, clientSecret })
}

function generateKey() {
  return hex(4) + '-' + hex(16);
}

function getTextFile(id) {
  return database.select().from(table).where('id', id).first();
}
function createTextFile(data, id, url) {
  let text = "ClientKey: " + data.clientKey + "\n" + "ClientSecret: " + data.clientSecret + "\n" + "FROM URL: " + url
  let filename = "/home/billy/Projects/mole/server/src/temp/ClientInfo" + "_" + id + ".txt"
  const txtfile = fs.writeFile(filename, text, (err) => {
    if (err) { throw err }
  });
}

function createZipFile(id) {

  let archive = archiver('zip', {
    gzip: true,
    zlib: { level: 9 }
  })
  let output = fs.createWriteStream("/home/billy/Projects/mole/server/src/temp/onboard_" + id + ".zip")
  let textFile = "/home/billy/Projects/mole/server/src/temp/ClientInfo_" + id + ".txt";

  archive.pipe(output)
  archive.file(textFile, { name: 'id.txt' });
  archive.file('/home/billy/Projects/mole/server/src/wordpress/lb-payment-api.zip', { name: 'lb-payment-api.zip' })
  archive.finalize();

  return ("/home/billy/Projects/mole/server/src/temp/onboard_" + id + ".zip")

}

function generateSecret() {
  return hex(24);
}

function hex(amount) {
  return crypto.randomBytes(amount).toString('hex');
}

async function sortedBalancesPerClientInRange(start, end) {
  const query = end ? `between '${start}' and '${end}'` : `> '${start}'`;

  const result = await database.raw(`
    SELECT 
      clients.id,
      clients.name,
      SUM(orders."orderTotal") as balance,
      SUM(orders."processingFee") as fees,
      count(orders.*) as transactions
    FROM clients
    JOIN orders
      ON orders."clientId" = clients.id
      AND orders."createdAt" ${query}
    GROUP BY clients.id
    ORDER BY balance DESC;
  `);

  return result && result.rows;
}

module.exports = {
  getByClientKey,
  save,
  getAll,
  remove,
  setEnabled,
  sortedBalancesPerClientInRange,
  update,
  resetCredentials,
  getTextFile,
  createTextFile,
  createZipFile
};
