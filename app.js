import express from 'express'
import { PORT, TOKEN } from './config.js'
import { getMainMenu } from './keyboards.js'
import { commands , text1, text2, text3} from './const.js'
import {vacancyScene} from './scenes/vacancy.js'
import {resumeScene} from './scenes/resume.js'
import {taskScene} from './scenes/task.js'

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const app = express()

import {Markup, Scenes, session, Telegraf} from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN )//сюда помещается токен, который дал botFather

bot.start( async (ctx) => {
    try{
        await ctx.replyWithHTML(
            `Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}!`,
            getMainMenu(), console.log(ctx.message))
    } catch (e){
        console.log(e)
    }
})//ответ бота на команду /start

bot.help((ctx) => ctx.reply(commands)) //ответ бота на команду /help
const stage = new Scenes.Stage([vacancyScene, resumeScene, taskScene])
bot.use(session())
bot.use(stage.middleware())

bot.hears('Регистрация', (ctx) => ctx.scene.enter('vacancyWizard')) // bot.hears это обработчик конкретного текста
bot.hears('Другие задачи', (ctx) => ctx.scene.enter('vacancyWizard')) // bot.hears это обработчик конкретного текста
bot.hears('Еще задачи', (ctx) => ctx.scene.enter('taskWizard')) // bot.hears это обработчик конкретного текста

// Обработка команды /course
bot.command('course', async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Курсы</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('Редакторы', 'btn_1'), Markup.button.callback('Обзоры', 'btn_2'), Markup.button.callback('JS', 'btn_3')],
                [Markup.button.callback('Общая большая', 'btn_4')]
            ]
        ))
    } catch (e) {
        console.error(e)
    }
})

function addActionBot(id_btn, src_img, text, preview) {
    bot.action(id_btn, async (ctx) => {
        try {
            await ctx.answerCbQuery()
            if (src_img !== false) {
                await ctx.replyWithPhoto({
                    source: src_img
                })
            }
            await ctx.replyWithHTML(text, {
                disable_web_page_preview: preview
            })
        } catch (e) {
            console.error(e)
        }
    })
}

// Обработчик кнопок с помощью функции
addActionBot('btn_1', './img/1.jpg', text1, true)
addActionBot('btn_2', './img/2.jpg', text2, true)
addActionBot('btn_3', false, text3, false)

bot.on('sticker', (ctx) => ctx.reply('Вау, стикер')) //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения
bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"
bot.hears('хочу есть', ctx => {
    ctx.reply('Так передохни и покушай')
})
// bot.hears('Мои задачи', ctx => {
//     ctx.reply('Тут будут ваши задачи')
// })
bot.hears('Смотивируй меня', ctx => {
    ctx.replyWithPhoto(
        'https://img2.goodfon.ru/wallpaper/nbig/7/ec/justdoit-dzhastduit-motivaciya.jpg',
        {
            caption: 'Не вздумай сдаваться!'
        }
    )
})

bot.on('text', ctx => {
    ctx.replyWithHTML(
        `Вы действительно хотите добавить задачу:\n\n`+
        `<i>${ctx.message.text}</i>`
    )
})

// bot.hears('Добавить задачу', ctx => {
//     ctx.reply('Тут вы сможете добавить свои задачи')
// })

bot.command('time', ctx => {
    ctx.reply(String(new Date()))
})
bot.launch()


app.get('/', (req, res) => {
    res.send('Hello. I changed this again')
})

app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))