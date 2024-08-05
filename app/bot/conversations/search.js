module.exports = options => bot => {
    const pagination = options.inlinePaginationKeyboard;
    const marketDetails = options.marketDetailsKeyboard;
    const marketsService = options.marketsService;

    /**
     * @param {string} coin
     * @param {import('grammy').CallbackQueryContext} ctx
     */
    const onItemClick = async (coin, ctx) => {
        const market = marketsService.getMarketByCoin(coin);

        if (!market)
            return await ctx.reply(ctx.t('coin_not_found'));

        const userId = ctx.from.id;
        const message = marketDetails.setMarket(userId, market).getMessage(userId);
        const reply_markup = await marketDetails.getMarkup(userId, ctx);

        if (!message || !reply_markup)
            return await ctx.reply('Market detail error');

        await ctx.reply(ctx.t(...message), {
            parse_mode: 'HTML',
            reply_markup
        });
    }

    const onAddMonitor = async (coin, ctx) => {
        ctx.state = { coin };
        await ctx.conversation.enter('addMonitorConversation');
    };

    const onShowMonitor = (coin, ctx) => {
        ctx.reply(`Show Monitor for ${coin}`);
    };

    marketDetails.init(bot, { onAddMonitor, onShowMonitor });
    pagination.init(bot, {
        onItemClick,
        renderItem: i => `${i.getName()} (${i.getCoin()})`,
        resolveItemId: i => i.getCoin()
    });

    return async function searchConversation(conversation, ctx) {
        await ctx.reply(ctx.t('search_wait'));
        const { msg: { text } } = await conversation.waitFor("message:text");

        /**
         * @type {Array<import('../../market/Market')>}
         */
        const markets = marketsService.findMarkets(text);

        if (markets.length === 0) {
            await ctx.reply(ctx.t('nothing_found'));
            return;
        }

        pagination.setItems(ctx.from.id, markets);

        await ctx.reply(ctx.t('found', { number: markets.length }), {
            reply_markup: pagination.getMarkup(ctx.from.id)
        });

        return;
    };
};