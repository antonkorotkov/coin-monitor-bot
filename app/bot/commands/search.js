const search = async ctx => {
    await ctx.conversation.enter('searchConversation');
};

module.exports = search;