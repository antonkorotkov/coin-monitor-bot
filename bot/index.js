const { Bot, session } = require('grammy');
const { I18n } = require("@grammyjs/i18n");
const { conversations, createConversation } = require('@grammyjs/conversations');

const User = require('../db/schemas/User');
const logger = require('../logger');
const MarketCollection = require('../market');
const { start, search } = require('./commands');
const allConversations = require('./conversations');

const i18n = new I18n({
    defaultLocale: "en",
    directory: "bot/locales"
});

const initialize = () => {
    const bot = new Bot(process.env.BOT_TOKEN);
    const marketsCollection = new MarketCollection({
        onMarketsChange: changed => {
            console.log(changed.length);
        }
    });

    marketsCollection.refresh();

    bot.catch = err => {
        console.error('ERROR', err);
    };

    bot.use(logger);
    bot.use(i18n);
    bot.use(session({ initial: () => ({}) }));
    bot.use(conversations());

    allConversations.forEach(c => bot.use(createConversation(c({ marketsCollection }))));

    bot.command('start', start);
    bot.command('search', search);

    bot.on('my_chat_member', async ctx => {
        if (['kicked', 'left'].includes(ctx.myChatMember.new_chat_member.status))
            await User.deactivate(ctx.myChatMember.chat.id);
    });

    bot.start();
};

module.exports = initialize;