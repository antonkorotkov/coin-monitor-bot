const User = require("../../db/schemas/User");

const start = async ctx => {
    await User.createOrUpdate({
        telegramId: ctx.chat.id,
        nickname: ctx.chat.username,
        firstName: ctx.chat.first_name,
        lastName: ctx.chat.last_name
    });
    ctx.reply(ctx.t('start', { name: ctx.chat.first_name ?? ctx.chat.username ?? '' }));
};

module.exports = start;