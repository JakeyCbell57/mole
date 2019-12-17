const Responses = require('../../payments/responses');
const axios = require('axios');

/**
 * This function should be used to check the connection with Stripe
 * and to validate credentials.
 * 
 * This function must return true or false.
 * 
 * @param {object} data object containing apiKey
 * @param {*} url the url of the processor
 * 
 * @return true or false
 */
async function ping(data, url) {
  try {
    const response = await getBalance(data, url);
    return response.object && response.object === 'balance';

  } catch (err) {
    console.log(err)
    console.log(`[${data.processorId}] - ${err.message || err}`);
    return false;
  }
}

async function getBalance(data, url) {
  const response = await axios.post(url + '/balance', {}, headers(data.apiKey));
  return response.data;
}

async function processOrder(data, url) {
  const params = {
    cardNumber: data.cardNumber,
    expiryMonth: data.expiryMonth,
    expiryYear: data.expiryYear,
    cvv: data.cvv,
    orderTotal: data.orderTotal
  };

  const response = await axios.post(url + '/payment', params, headers(data.apiKey));
  console.log(response)
  return Responses.order(response.data);
}

function headers(apiKey) {
  return {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  };
}

module.exports = {
  processOrder,
  getBalance,
  ping
};
