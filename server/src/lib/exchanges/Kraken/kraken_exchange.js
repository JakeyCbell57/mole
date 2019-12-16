
const KrakenClient = require('./kraken');
const key = process.env.KRAKEN_KEY;
const secret = process.env.KRAKEN_SECRET;
const kraken = new KrakenClient(key, secret);

const MIN_CAD_BALANCE = 100;
const MIN_BTC_BALANCE = 0.001;

async function krakenBuyBTC() {

  //Get current Balance of CAD in Kraken Wallet
  let balance = await kraken.api('Balance');
  console.log({ balance })

  if (balance && balance.result && parseFloat(balance.result.ZCAD) >= MIN_CAD_BALANCE) {

    //Get current Market value of BTC
    let ticker = (await kraken.api('Ticker', { pair: 'XBTCAD' }));

    //Calculate Amount of BTC to purchase with funding
    let volume = karkenCalculateVolume(ticker, balance);

    let buy_order_BTC = await kraken.api('AddOrder', {
      validate: true,
      pair: 'XBTCAD',
      type: 'buy',
      ordertype: 'market',
      volume,
      starttm: '0'
    });

    return buy_order_BTC;

  } else {
    return false;
  }


}


/*Calculate possible volume*/
function karkenCalculateVolume(ticker, balance) {

  let bid_price = ticker.result.XXBTZCAD.a[0];
  let volume = balance.result.ZCAD / bid_price;
  return volume

}

/*Transfer BTC*/
async function krakenTransfer() {
  let balance = await kraken.api('Balance');

  console.log({ balance })

  if (balance && balance.result && parseFloat(balance.result.XXBT) >= MIN_BTC_BALANCE) {

    let btcBalance = balance.result.XXBT;

    let walletTransfer = await kraken.api('Withdraw', {
      asset: 'XBT',
      key: process.env.KRAKEN_WITHDRAW_KEY,
      amount: btcBalance
    });

    return { ...walletTransfer, btcBalance };

  } else {
    return false;
  }

}



module.exports = {
  krakenBuyBTC,
  krakenTransfer
};
