const { InlineKeyboard } = require('grammy');
const moment = require("moment");
const Monitor = require('../../db/schemas/Monitor');

const truncateNumber = num => {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    } else {
        return num.toFixed(2);
    }
}

class MarketDetailsKeyboard {

    /** @type {import('../../market/Market')} */
    #market;
    #formatter;
    #ctx;

    constructor() {
        this.#formatter = Intl.NumberFormat({});
    }

    /**
     * @param {import('grammy').Bot} bot
     */
    init(bot, { onAddMonitor, onShowMonitor }) {
        bot.on("callback_query:data", async (ctx, next) => {
            if (ctx.callbackQuery.data.includes('addMonitor:')) {
                const [, coin] = ctx.callbackQuery.data.split(':');
                onAddMonitor(coin, ctx);
            }

            if (ctx.callbackQuery.data.includes('showMonitor:')) {
                const [, id] = ctx.callbackQuery.data.split(':');
                onShowMonitor(id, ctx);
            }

            await next();
        });
    }

    setContext(ctx) {
        this.#ctx = ctx;
    }

    /**
     * @param {import('../../market/Market')} market
     */
    setMarket(market) {
        this.#market = market;
    }

    getMessage() {
        const updated = moment(this.#market.getLastUpdated());

        return ['market_message', {
            name: this.#market.getName(),
            coin: this.#market.getCoin(),
            price: this.#formatter.format(this.#market.getPrice(true)),
            fiat: this.#market.getFiat(),
            volume: truncateNumber(this.#market.getVolume(true)),
            last_update: updated.from(moment())
        }];
    }

    async getMarkup() {
        const user = this.#ctx.update.callback_query.from;
        const existingMonitor = await Monitor.findOne({ coin: this.#market.getCoin(), telegramId: user.id });

        const keyboard = new InlineKeyboard();
        keyboard.row();

        if (!existingMonitor)
            keyboard.text(this.#ctx.t('add_monitor'), `addMonitor:${this.#market.getCoin()}`);
        else
            keyboard.text(this.#ctx.t('show_monitor'), `showMonitor:${existingMonitor._id}`);

        return keyboard;
    }
}

module.exports = MarketDetailsKeyboard;