const {Responses} = require('../../payments');

function connected() {
  return true;
}

function processOrder() {
  return Responses.order({
    status: Responses.DECLINED,
  });
}

module.exports = {
  processOrder,
  connected
};
