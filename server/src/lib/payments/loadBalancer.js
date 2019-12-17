const ProcessorTypes = require('../processors/types');
const ResponseCodes = require('./responses');
const { Orders, Clients, Processors } = require('../');

const ENDPOINT_BASE = 'payment-processor';

const days = num => 1000 * 60 * 60 * 24 * num;

async function processOrder(data, client) {
  const lookback = Date.now() - days(0.5);

  //also get list of processors incase a processor hasnt made an order
  const [processors, processorTypes] = await Promise.all([
    Processors.sortedBalancesPerProcessorSince(lookback),
    Processors.getProcessorTypes()
  ]);

  console.log({ processors, processorTypes })

  const splitExpiry = data && formatExpiry(data.expiry);
  const [expiryMonth, expiryYear] = splitExpiry;

  for (const processor of processors) {
    const type = processorTypes.find(typeById(processor.id))
    const gateway = ProcessorTypes[type.codeName];
    const url = formatUrl(processor.url, type.codeName);
    const apiKey = processor.apiKey;

    const order = await safelyProcessOrder({ ...data, exipryMonth, expiryYear, apiKey }, gateway, url);

    if (order.status !== ResponseCodes.FATAL) {
      saveSuccessful(order, data, client, processor.id);
      return order;
    }
  }

  //no available gateways
  throw {
    status: 503,
    message: 'Service is unavailable. Please use other payment method.'
  }
}

async function saveSuccessful(order, data, client, processorId) {
  if (order && order.status === ResponseCodes.APPROVED) {
    try {
      await Orders.save({
        clientId: client.id,
        processorId,
        orderId: order.orderId,
        orderTotal: data.orderTotal,
        createdAt: order.createdAt
      });

    } catch (err) {
      console.log('Error saving order ' + JSON.stringify(order))
      console.log(err)
    }
  }
}

async function safelyProcessOrder(data, gateway, url) {
  try {
    const order = await gateway.processOrder(url, data);
    return order;

  } catch (err) {
    return {
      status: 'FATAL'
    }
  }
}

function formatUrl(url, type) {
  return url.replace(/(^http:\/\/|^https:\/\/)/, 'https://').replace(/\/+$/, '') + `/wp-json/${ENDPOINT_BASE}/${type}`;
}

function formatExpiry(expiry) {
  return expiry && expiry.split('/').map(el => el.trim());
}

function typeById(id) {
  return processorType => processorType.id === id
}

module.exports = {
  processOrder
};
