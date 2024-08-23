const search = async ctx => {
    const stats = await ctx.conversation.active();

    if (!Object.keys(stats).length)
        await ctx.conversation.enter('searchConversation');
};

module.exports = search;