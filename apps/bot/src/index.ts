import 'dotenv/config'
import { Telegraf, Markup } from 'telegraf'

const BOT_TOKEN = process.env.BOT_TOKEN!
const WEBAPP_URL = process.env.WEBAPP_URL!

if (!BOT_TOKEN) throw new Error('BOT_TOKEN missing')
if (!WEBAPP_URL) throw new Error('WEBAPP_URL missing')

const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => {
  return ctx.reply(
    'Откройте приложение Bayhan Mini‑App:',
    Markup.keyboard([[Markup.button.webApp('Открыть Mini‑App', WEBAPP_URL)]]).resize()
  )
})

bot.command('app', (ctx) => {
  return ctx.reply('Запуск Mini‑App', Markup.inlineKeyboard([
    Markup.button.webApp('Открыть Mini‑App', WEBAPP_URL)
  ]))
})

// Example notifier you can import from your API (via HTTP) in production
export async function notifyExchangeRequest(chatId: number, text: string) {
  await bot.telegram.sendMessage(chatId, text)
}

bot.launch().then(() => console.log('Bot started')).catch(console.error)

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
