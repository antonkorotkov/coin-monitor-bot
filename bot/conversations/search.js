const InlinePaginationKeyboard = require("../keyboards/InlinePaginationKeyboard");
const MarketDetailsKeyboard = require("../keyboards/MarketDetailsKeyboard");

const paginatedResponseKeyboard = new InlinePaginationKeyboard({
    renderItem: /** @param {import('../../market/Market')} i */ i => `${i.getName()} (${i.getCoin()})`,
    resolveItemId: /** @param {import('../../market/Market')} i */ i => i.getCoin()
});
const marketDetailsKeyboard = new MarketDetailsKeyboard();

module.exports = globalCtx => {

    /**
     * @param {string} coin
     * @param {import('grammy').CallbackQueryContext} ctx
     */
    const onPaginatedItemClick = async (coin, ctx) => {
        const market = globalCtx.marketsCollection.getMarketByCoin(coin);

        if (!market)
            return await ctx.reply(ctx.t('coin_not_found'));

        marketDetailsKeyboard.setContext(ctx);
        marketDetailsKeyboard.setMarket(market);

        await ctx.reply(ctx.t(...marketDetailsKeyboard.getMessage()), {
            parse_mode: 'HTML',
            reply_markup: await marketDetailsKeyboard.getMarkup()
        });
    }

    const onAddMonitor = (coin, ctx) => {
        ctx.reply(`Add Monitor for ${coin}`);
    };

    const onShowMonitor = (coin, ctx) => {
        ctx.reply(`Show Monitor for ${coin}`);
    };

    marketDetailsKeyboard.init(globalCtx.bot, { onAddMonitor, onShowMonitor });
    paginatedResponseKeyboard.init(globalCtx.bot, { onItemClick: onPaginatedItemClick });

    return async function searchConversation(conversation, ctx) {
        await ctx.reply(ctx.t('search_wait'));
        const { msg: { text } } = await conversation.waitFor("message:text");

        /**
         * @type {Array<import('../../market/Market')>}
         */
        const markets = globalCtx.marketsCollection.findMarkets(text);

        if (markets.length === 0) {
            await ctx.reply(ctx.t('nothing_found'));
            return;
        }

        paginatedResponseKeyboard.setItems(markets);

        await ctx.reply(ctx.t('found', { number: markets.length }), {
            reply_markup: paginatedResponseKeyboard.getMarkup()
        });
    };
};