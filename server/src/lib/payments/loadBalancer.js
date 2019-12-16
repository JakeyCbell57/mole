const ProcessorTypes = require('../processors/types');
const ResponseCodes = require('./responses');
const { Orders, Clients, Processors } = require('../');

const days = num => 1000 * 60 * 60 * 24 * num;

async function processOrder(data) {
  const lookback = Date.now() - days(0.5);
  const [ processors, processorTypes ] = await Promise.all([
    Processors.sortedBalancesPerProcessorSince(lookback),
    Processors.getProcessorTypes()
  ]);

  for(const processor of processors) {
    const type = processorTypes.find(typeById(processor.id))
    const gateway = ProcessorTypes[type.codeName];

    const order = await safelyProcessOrder(data, gateway);

    if(order.status !== ResponseCodes.FATAL) {
      saveSuccessful(order, data.clientKey, processor.id);
      return order;
    }
  }
}

async function saveSuccessful(order, clientKey, processorId) {
  if(order && order.status === ResponseCodes.APPROVED) {
    try {
      const client = await Clients.getByClientKey(clientKey);
      await Orders.save({
        clientId: client.id,
        processorId,
        orderId: order.orderId,
        orderTotal: order.orderTotal,
        processingFee: order.processingFee,
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

function typeById(id) {
  return processorType => processorType.id === id
}

module.exports = {
  processOrder
};
