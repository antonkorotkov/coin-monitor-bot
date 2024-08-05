module.exports = options => bot => {

    return async function addMonitorConversation(conversation, ctx) {
        await ctx.reply('Add monitor conversation started');
        await ctx.reply(ctx.state.coin);

        const { msg: { text } } = await conversation.waitFor("message:text");
    };
};