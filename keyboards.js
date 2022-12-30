import {Markup} from 'telegraf'
export function getMainMenu() {
    return Markup.keyboard([
        ['Регистрация', 'Добавить задачу'],
        ['Еще задачи']
    ]).oneTime().resize()
}
