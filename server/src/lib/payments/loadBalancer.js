const ProcessorTypes = require('../processors/types');
const ResponseCodes = require('./responses');
const { Orders, Clients, Processors } = require('../');

const ENDPOINT_BASE = '/custom';

const days = num => 1000 * 60 * 60 * 24 * num;

async function processOrder(data) {
  const lookback = Date.now() - days(0.5);
  const [processors, processorTypes] = await Promise.all([
    Processors.sortedBalancesPerProcessorSince(lookback),
    Processors.getProcessorTypes()
  ]);

  const [expiryMonth, exipryYear] = data && formatExpiry(data.exipry);

  for (const processor of processors) {
    const type = processorTypes.find(typeById(processor.id))
    const gateway = ProcessorTypes[type.codeName];
    const url = processor.url;

    const order = await safelyProcessOrder({ ...data, exipryMonth, expiryYear }, gateway);

    if (order.status !== ResponseCodes.FATAL) {
      saveSuccessful(order, data, processor.id);
      return order;
    }
  }

  //no available gateways
  throw {
    status: 503,
    message: 'Service is unavailable. Please use other payment method.'
  }
}

async function saveSuccessful(order, data, processorId) {
  if (order && order.status === ResponseCodes.APPROVED) {
    try {
      const client = await Clients.getByClientKey(data.clientKey);
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

async function safelyProcessOrder(data, gateway) {
  try {
    const order = await gateway.processOrder(data);
    return order;

  } catch (err) {
    return {
      status: 'FATAL'
    }
  }
}

function formatUrl(url) {
  return url.replace(/(^http:\/\/|^https:\/\/)/, 'https://').replace(/\/+$/, '') + ENDPOINT_BASE;
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
