const { conversations, createConversation } = require("@grammyjs/conversations");
const { I18n } = require("@grammyjs/i18n");
const { Bot, GrammyError, HttpError, session } = require("grammy");

const { start, search } = require("./commands");
const User = require("../db/schemas/User");

const i18n = new I18n({
    defaultLocale: "en",
    directory: "bot/locales"
});

class TelegramBot {
    #log;
    #bot;
    #pagination;

    constructor(options) {
        this.#pagination = options.inlinePaginationKeyboard;
        this.#log = options.logger.debug(this.constructor.name);
        this.#log('Initializing...');

        this.#bot = new Bot(options.config.telegramBotToken);
        this.#bot.catch(args => this.errorHandler(args));
        this.#bot.use(options.logger.middleware(this.constructor.name));
        this.#bot.use(i18n);
        this.#bot.use(session({ initial: () => ({}), type: 'single' }));
        this.#bot.use(conversations());
        this.#bot.use(createConversation(options.conversationAddMonitor(this.#bot)));
        this.#bot.use(createConversation(options.conversationDeleteMonitor(this.#bot)));
        this.#bot.use(createConversation(options.conversationSearch(this.#bot)));

        this.#bot.command('start', start);
        this.#bot.command('search', search);

        this.#bot.on('my_chat_member', async ctx => {
            if (['kicked', 'left'].includes(ctx.myChatMember.new_chat_member.status)) {
                await User.deactivate(ctx.myChatMember.chat.id);
                this.#pagination.flushUserCache(ctx.from.id);
            }
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
        this.#bot.start();
    }
}

module.exports = TelegramBot;