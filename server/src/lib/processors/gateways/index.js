const stripe = require('./stripe');

module.exports = codeName => {
  switch(codeName) {
    case 'stripe': return stripe;
  }
}
