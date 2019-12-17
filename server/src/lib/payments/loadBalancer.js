const ResponseCodes = require('./responses');
const Orders = require('../orders/orders');
const Processors = require('../processors/processors');

/**
 * The main order processing function.
 * 
 * The data parameter accepts card info as: 
 * 
 * {
 *    cardNumber: 'xxxxxxxxxxxxxxxx',
 *    expiry: 'xx / xx',
 *    cvv: 'xxx'
 * }
 * 
 * Card data going out to be processed will be formatted as:
 * 
 *  { 
 *    cardNumber: 'xxxxxxxxxxxxxxxx',
 *    expiryMonth: 'xx',
 *    expiryYear: 'xx,
 *    cvv: 'xxx'
 * }
 * 
 * An order will be attempted on the processor with the lowest balance.
 * Orders that fail due to a FATAL processor error will be attempted on the next
 * processor until all processors have been attempted. If all processors fail, a 503
 * code is returned to the client.
 * 
 * @param {object} data card info, orderTotal
 * @param {*} client client requesting the order
 * 
 * @return the order response from the first available processor
 */
async function processOrder(data, client) {
  const lookback = days(0.5);
  const { processors, processorTypes, expiryMonth, expiryYear } = await prepareOrder(data, client, lookback);
  
  for (const processor of processors) {
    const type = processorTypes.find(typeById(processor.processorType));
    const gateway = Processors.getGateways(type.codeName);
    const url = Processors.formatUrl(processor.url, type.codeName);

    const order = await safelyProcessOrder({ ...data, expiryMonth, expiryYear, apiKey: processor.apiKey }, gateway, url, processor.id);

    if (order.status !== ResponseCodes.FATAL) {
      saveSuccessful(order, data, client, processor.id);
      return order;

    } else {
      console.log(JSON.stringify(order))
    }
  }

  //no available gateways
  throw {
    status: 503,
    message: 'Service is unavailable. Please use other payment method.'
  }
}


async function prepareOrder(data, client, lookback) {
  const [processors, processorTypes] = await Promise.all([
    Processors.sortedBalancesPerProcessorSince(lookback),
    Processors.getProcessorTypes()
  ]);

  const splitExpiry = data && formatExpiry(data.expiry);
  const [expiryMonth, expiryYear] = splitExpiry;

  return {
    processors, 
    processorTypes,
    expiryMonth,
    expiryYear
  };
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


async function safelyProcessOrder(data, gateway, url, processorId) {
  try {
    const order = await gateway.processOrder(data, url);
    return order;

  } catch (err) {
    console.log(err)
    console.log(`[${processorId}] - ${err.message || err}`);
    return {
      status: 'FATAL'
    };
  }
}


// =========================
// utils
// =========================

function formatExpiry(expiry) {
  return expiry && expiry.split('/').map(el => el.trim());
}


function typeById(id) {
  return processorType => processorType.id === id;
}

function days(num) {
  return 1000 * 60 * 60 * 24 * num;
}


module.exports = {
  processOrder
};
