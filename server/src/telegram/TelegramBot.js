const Telegram = require('node-telegram-bot-api')
const Commands = require('./Commands')
const database = require('../database')

const botTable = 'telegram_bot';

const YOURE_WELCOME = ["Don't mention it", 'Fuck off!!', 'What?', 'Get outta town bro', "You're welcome!", "You're welcome, bro!"]

class TelegramBot {

  constructor(token) {
    if (token) {
      this.bot = new Telegram(token, { polling: true })
      this._init()
    }
  }

  async sendMessage(message) {
    try {
      const chats = await database.select('chat_id').from(botTable)

      if (chats.length > 0) {
        chats.forEach(async chat => {

          try {
            await this.bot.sendMessage(chat.chat_id, message, { parse_mode: 'html' })

          } catch (err) {
            console.error(err.response.body)
          }
        })
      }

    } catch (err) {
      console.error(err)
    }
  }

  _init() {
    this.bot.on('message', this._initCommands.bind(this))
    this.bot.on('polling-error', this._initErrors.bind(this))
  }

  _initCommands(message) {
    Object.keys(Commands).forEach(command => {
      try {
        Commands[command].action(message, this.bot)

      } catch (err) {
        console.error(err)
      }
    })

    if (message.text.trim() === '/thanks') {
      this.bot.sendMessage(message.chat.id, YOURE_WELCOME[(Math.floor(Math.random() * YOURE_WELCOME.length) + 1) - 1])
    }
  }

  _initErrors(error) {
    try {
      console.log('there was an error')
      if (error.code === 'ETELEGRAM') {
        this.bot.startPolling({ restart: true })
      }

    } catch (err) {
      console.error(err)
    }
  }
}
const token = process.env.TELEGRAM_AUTH_TOKEN;
const bot = token ? new TelegramBot(token) : null;

module.exports = bot;
