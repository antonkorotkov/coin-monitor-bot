const { InlineKeyboard } = require('grammy');
const moment = require("moment");
const Monitor = require('../../db/schemas/Monitor');
const truncate = require('../../utils/truncate');
const AbstractPersonalizedCache = require('./AbstractPersonalizedCache');

class MarketDetailsKeyboard extends AbstractPersonalizedCache {

    /**
     * @param {import('grammy').Bot} bot
     */
    init(bot, { onAddMonitor, onShowMonitor }) {
        bot.on("callback_query:data", async (ctx, next) => {
            if (ctx.callbackQuery.data.includes('addMonitor')) {
                if (!this.#canAddMonitor(ctx.chat.id))
                    return await ctx.reply('You cannot add more than 5 monitors.');

                const market = this.#getMarket(ctx.chat.id);
                if (!market)
                    return await ctx.reply('Oops... Looks like you were thinking for too long. Try again from search.');

                await onAddMonitor(market.getId(), market.getCoin(), market.getPrice(true), ctx);
            }

            if (ctx.callbackQuery.data.includes('showMonitor:')) {
                const [, id] = ctx.callbackQuery.data.split(':');
                await onShowMonitor(id, ctx);
            }

            await next();
        });
    }

    /**
     * @param {number} userId
     * @param {import('../../market/Market')} market
     */
    async setMarket(userId, market) {
        const userMonitors = await Monitor.find({ telegramId: userId });
        this.setUserCacheEntity(userId, 'can_add_monitor', userMonitors.length < 5);

        const existingMonitor = userMonitors.find(m => m.coinId === market.getId());
        if (existingMonitor)
            this.setUserCacheEntity(userId, 'market_monitor', existingMonitor);
        else
            this.flushUserCache(userId, 'market_monitor');

        return this.setUserCacheEntity(userId, 'market_details', market);
    }

    /**
     * @param {string} userId
     */
    getMarketMonitor(userId) {
        return this.getUserCache(userId, 'market_monitor');
    }

    /**
     * @param {number} userId
     * @returns {import('../../market/Market') | undefined}
     */
    #getMarket(userId) {
        return this.getUserCache(userId, 'market_details');
    }

    #canAddMonitor(userId) {
        return this.getUserCache(userId, 'can_add_monitor');
    }

    /**
     * @param {number} userId
     */
    getMessage(userId) {
        const market = this.#getMarket(userId);
        if (!market)
            return undefined;

        const updated = moment(market.getLastUpdated());
        const monitor = this.getMarketMonitor(userId);

        const messageParams = {
            name: market.getName(),
            coin: market.getCoin(),
            price: Intl.NumberFormat().format(market.getPrice(true)),
            fiat: market.getFiat(),
            volume: truncate(market.getVolume(true)),
            last_update: updated.from(moment())
        };

        if (monitor) {
            const monitorMessageParams = {
                monitor_type: monitor.threshold.type === 'percentage' ? '%' : '$',
                monitor_value: monitor.threshold.value
            };
            return ['market_message_monitor', { ...messageParams, ...monitorMessageParams }];
        }

        return ['market_message', messageParams];
    }

    /**
     * @param {number} userId
     * @returns {InlineKeyboard | undefined}
     */
    async getMarkup(userId, ctx) {
        const market = this.#getMarket(userId);
        if (!market)
            return undefined;

        const existingMonitor = this.getMarketMonitor(userId);
        const keyboard = new InlineKeyboard();
        keyboard.row();

        if (!existingMonitor)
            keyboard.text(ctx.t('add_monitor'), 'addMonitor');
        else
            keyboard.text(ctx.t('delete_monitor'), `deleteMonitor:${existingMonitor._id}`);

        return keyboard;
    }
}

module.exports = MarketDetailsKeyboard;