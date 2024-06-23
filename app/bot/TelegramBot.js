const { I18n } = require("@grammyjs/i18n");
const { Bot } = require("grammy");

const i18n = new I18n({
    defaultLocale: "en",
    directory: "app/bot/locales"
});

class TelegramBot {
    #log;
    bot;

    constructor(options) {
        this.#log = options.logger.debug(this.constructor.name);
        this.bot = new Bot(options.config.telegramBotToken);

        this.#log('Initializing...');
        this.bot.catch(this.errorHandler);
        this.bot.use(options.logger.middleware(this.constructor.name));
        this.bot.use(i18n);
        this.bot.command('start', async ctx => {
            await ctx.reply('Test');
        });
    }

    errorHandler({ ctx, error }) {
        this.#log('Error while handling update %s:', ctx.update.update_id);

        if (error instanceof GrammyError) {
            this.#log('Error in request: %s', error.description);
        } else if (error instanceof HttpError) {
            this.#log('Could not contact Telegram:', error);
        } else {
            this.#log("Unknown error:", error);
        }
    }

    start() {
        this.#log('Started.');
        this.bot.start();
    }
}

module.exports = TelegramBot;