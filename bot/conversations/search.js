const InlinePaginationKeyboard = require("../keyboards/InlinePaginationKeyboard");

const paginatedResponseKeyboard = new InlinePaginationKeyboard({
    renderItem: /** @param {import('../../market/Market')} i */ i => `${i.getName()} (${i.getCoin()})`,
    resolveItemId: /** @param {import('../../market/Market')} i */ i => i.getCoin()
});

module.exports = globalCtx => {
    paginatedResponseKeyboard.init(globalCtx.bot, async (coin, ctx) => {
        const market = globalCtx.marketsCollection.getMarketByCoin(coin);

        if (!market)
            return await ctx.reply('Currency not found or not available anymore');

        await ctx.reply(market.getPrice());
    });

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

        paginatedResponseKeyboard.setItems(markets);

        await ctx.reply(`Found ${markets.length} coin(s). Select one for details and further actions:`, {
            reply_markup: paginatedResponseKeyboard.getMarkup()
        });
    };
};