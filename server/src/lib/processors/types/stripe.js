const { Responses } = require('../../payments');

function connected() {
  return true;
}

function processOrder(data) {

  const params = {
    cardNumber: data.cardNumber,
    expiryMonth: data.expiryMonth,
    expiryYear: data.expiryYear,
    cvv: data.cvv,
    orderTotal: data.orderTotal
  }


  return Responses.order({
    status: Responses.DECLINED,
  });
}

module.exports = {
  processOrder,
  connected
};
