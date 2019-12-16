const scheduler = require('node-schedule');
const kraken = require('./lib/exchanges/Kraken/kraken_exchange');
const { TelegramBot } = require('./telegram');

const INTERVAL = 5;
const EVERY_N_MINUTES = `*/${INTERVAL} * * * *`;

scheduler.scheduleJob(EVERY_N_MINUTES, () => {
  try {
    //check balances
    //buy btc
    //transfer btc



  } catch (error) {
    console.log(error)
  }
});

async function buy() {
  const response = await kraken.krakenBuyBTC();

  console.log({ buyResponse: response });

  if (response && response.result.descr && response.result.descr.order) {
    await TelegramBot.sendMessage(`Buy: ${response.result.descr.order}`);
  }
}

async function transfer() {
  const response = await kraken.krakenTransfer();
  console.log({ transferResponse: response })

  if (response && response.result && response.result.refid) {
    await TelegramBot.sendMessage(`Transfer: ${response.btcBalance} BTC (Minus fees)`);
  }

}
