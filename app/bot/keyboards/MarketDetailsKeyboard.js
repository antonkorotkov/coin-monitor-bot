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
            if (ctx.callbackQuery.data.includes('addMonitor:')) {
                const [, coin] = ctx.callbackQuery.data.split(':');
                await onAddMonitor(coin, ctx);
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
    setMarket(userId, market) {
        return this.setUserCacheEntity(userId, 'market_details', market);
    }

    /**
     * @param {number} userId
     * @returns {import('../../market/Market') | undefined}
     */
    #getMarket(userId) {
        return this.getUserCache(userId, 'market_details');
    }

    /**
     * @param {number} userId
     */
    getMessage(userId) {
        const market = this.#getMarket(userId);
        if (!market)
            return undefined;

        const updated = moment(market.getLastUpdated());

        return ['market_message', {
            name: market.getName(),
            coin: market.getCoin(),
            price: Intl.NumberFormat().format(market.getPrice(true)),
            fiat: market.getFiat(),
            volume: truncate(market.getVolume(true)),
            last_update: updated.from(moment())
        }];
    }

    /**
     * @param {number} userId
     * @returns {InlineKeyboard | undefined}
     */
    async getMarkup(userId, ctx) {
        const market = this.#getMarket(userId);
        if (!market)
            return undefined;

        const existingMonitor = await Monitor.findOne({ coin: market.getCoin(), telegramId: userId });
        const keyboard = new InlineKeyboard();
        keyboard.row();

        if (!existingMonitor)
            keyboard.text(ctx.t('add_monitor'), `addMonitor:${market.getCoin()}`);
        else
            keyboard.text(ctx.t('show_monitor'), `showMonitor:${existingMonitor._id}`);

        return keyboard;
    }
}

module.exports = MarketDetailsKeyboard;