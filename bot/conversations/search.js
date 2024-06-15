const InlinePaginationKeyboard = require("../keyboards/InlinePaginationKeyboard");

module.exports = globalCtx => {
    return async function searchConversation(conversation, ctx) {
        await ctx.reply('Enter the name or code of the crypto currency to search for:');
        const { msg: { text } } = await conversation.waitFor("message:text");

        /**
         * @type {Array<import('../../market/Market')>}
         */
        const markets = globalCtx.marketsCollection.findMarkets(text);

        if (markets.length === 0) {
            await ctx.reply('Nothing found');
            return;
        }

        const paginatedResponseKeyboard = new InlinePaginationKeyboard(markets, {
            renderItem: /** @param {import('../../market/Market')} i */ i => `${i.getName()} (${i.getCoin()})`
        });

        await ctx.reply(`Found ${markets.length} coin(s):`, {
            reply_markup: paginatedResponseKeyboard.getMarkup()
        });
    };
};