import {Markup, Scenes, Composer, } from 'telegraf'
const startStep = new Composer();
startStep.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data = {};
        ctx.wizard.state.data.userName = ctx.message.from.username;
        ctx.wizard.state.data.userId = ctx.message.from.id;
        ctx.wizard.state.data.firstName = ctx.message.from.first_name;
        ctx.wizard.state.data.lastName = ctx.message.from.last_name;
        ctx.wizard.state.data.step = ctx.message.text;
        await ctx.replyWithHTML(
            `Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}!\n Введите имя ребенка`, console.log(   ctx.wizard.state.data))
        return ctx.wizard.next()
    } catch (e) {
        console.log(e);
    }
});
const titleStep = new Composer();
titleStep.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.babyName = ctx.message.text;
        await ctx.replyWithHTML(
            `Введите дату рождения ребенка\n Формат дд.мм.гггг`, console.log(   ctx.wizard.state.data))
        return ctx.wizard.next()
    } catch (e) {
        console.log(e);
    }
});

const finishStep = new Composer();
finishStep.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data.birthday = ctx.message.text;
        const wizardData =  ctx.wizard.state.data
        await ctx.replyWithHTML( `<b> ${wizardData.babyName}</b>`, console.log(   ctx.wizard.state.data))
        return ctx.scene.leave()
    } catch (e) {
        console.log(e);
    }
});
export const vacancyScene = new Scenes.WizardScene('vacancyWizard', startStep, titleStep, finishStep)