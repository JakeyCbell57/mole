const Coinbase = require('coinbase');
const CoinbasePro = require('coinbase-pro');

const key = 'your_api_key';
const secret = 'your_b64_secret';
const passphrase = 'your_passphrase';

const apiURI = 'https://api.pro.coinbase.com';

const coinbase = new Coinbase.Client({
  apiKey: process.env.COINBASE_API_KEY,
  apiSecret: process.env.COINBASE_API_SECRET
});

const authenticated = new CoinbasePro.AuthenticatedClient({
  key,
  secret,
  passphrase,
  apiURI
});

function buyBTC({ order_total, order_id }) {
  const { accountNumber, paymentMethod } = null;

  coinbase.getAccount(accountNumber, (err, account) => {
    if (err) console.error(error)

    account.buy({ amount: order_total, currency: 'btc', payment_method: paymentMethod }, transaction => {
      console.log(transaction);
    });
  });
}

async function transferToExternalWallet(amount, address) {
  const result = await authenticated.withdrawCrypto({ amount, currency: 'BTC', crypto_address: address });
}

module.exports = {
  buyBTC
};

