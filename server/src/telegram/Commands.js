const database = require('../database')
const botTable = 'telegram_bot'
const TELEGRAM_BOT_KEY = process.env.TELEGRAM_BOT_KEY
require('./TelegramBot')

const Commands = {
  SUBSCRIBE: {
    command: '/subscribe',
    action: subscribe,
    description: 'Subscribe to the chat'
  },
  PING: {
    command: '/hello',
    action: ping,
    description: 'Check if a bot is subscribed to this chat'
  },
  HELP: {
    command: '/help',
    action: help,
    description: 'See all bot commands'
  }
}

async function subscribe(message, bot) {
  if (notEmpty(message) && message.text.startsWith(Commands.SUBSCRIBE.command)) {
    const bot_key = message.text.split(' ')[1]

    try {
      if (bot_key && bot_key.length === 16) {

        if (bot_key === TELEGRAM_BOT_KEY) {
          await database.insert({ chat_id: message.chat.id }, '*').into(botTable)

          const response = `Hey! Thanks for subscribing me to this chat! 😄\n\nI will post alerts about buying and transfering.\n`

          bot.sendMessage(message.chat.id, response, { parse_mode: 'html' })

        } else {
          bot.sendMessage(message.chat.id, "Theres a problem. I couldn't find your bot key... 🤔")
        }

      } else {
        bot.sendMessage(message.chat.id, 'Something went broke 😔\n\nLooks like you didnt enter a proper bot key...')
      }

    } catch (err) {
      if (err.code && err.code === database.errors.UNIQUE_CONSTRAINT) {
        bot.sendMessage(message.chat.id, "I've already been added to this chat!")

      } else {
        error(err)
        console.log('hello')
      }
    }
  }
}

async function ping(message, bot) {
  if (notEmpty(message) && message.text.trim() === Commands.PING.command) {
    try {
      const result = await database.select().from(botTable).where('chat_id', message.chat.id)

      const response = result.length > 0
        ? 'Hello! I am subscribed to this chat! 😄'
        : "Who are you? I'm not subscribed to this chat..."

      bot.sendMessage(message.chat.id, response)

    } catch (err) {
      console.log('hello')
      error(err)
    }
  }
}

async function help(message, bot) {
  if (notEmpty(message) && message.text.trim() === Commands.HELP.command) {
    const response = '<b>Help</b>\n\n' + Object.keys(Commands)
      .map(x => `<b>${Commands[x].command}</b> - <i>${Commands[x].description}</i>`)
      .join('\n\n')

    bot.sendMessage(message.chat.id, response, { parse_mode: 'html' })
  }
}

function notEmpty(message) {
  return message && message.text
}

function error(err) {
  console.error(err)
}

module.exports = Commands