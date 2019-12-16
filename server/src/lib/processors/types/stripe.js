const { Responses } = require('../../payments');
const axios = require('axios');

function connected() {
  return true;
}

function headers(apiKey) {
  return {
    headers: {
      'Authrorization': `Bearer ${apiKey}`
    }
  };
}

async function processOrder(data, url) {
  const params = {
    cardNumber: data.cardNumber,
    expiryMonth: data.expiryMonth,
    expiryYear: data.expiryYear,
    cvv: data.cvv,
    orderTotal: data.orderTotal
  };

  const response = await axios.post(url, params, headers(data.apiKey));
  return Responses.order(response.data);
}

module.exports = {
  processOrder,
  connected
};
