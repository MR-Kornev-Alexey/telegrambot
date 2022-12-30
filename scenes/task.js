import {Markup, Scenes, Composer, } from 'telegraf'
const startStep = new Composer();

startStep.on("text", async (ctx) => {
    try {
        ctx.wizard.state.data = {};
        ctx.wizard.state.data.userName = ctx.message.from.userName;
        ctx.wizard.state.data.firstName = ctx.message.from.first_name;
        ctx.wizard.state.data.lastName = ctx.message.from.last_name;
        await ctx.replyWithHTML(
            `Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}!\n Какая задача стоит перед тобой?`)
    } catch (e) {
        console.log(e);
    }
});
export const taskScene = new Scenes.WizardScene('taskWizard', startStep)