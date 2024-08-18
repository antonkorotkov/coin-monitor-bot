const { InlineKeyboard } = require("grammy");
const Monitor = require("../../db/schemas/Monitor");

const DELETE_CREATE = 'delete';
const CONFIRM_CANCEL = 'cancel';

module.exports = ({ logger }) => _ => {
    return async function deleteMonitorConversation(conversation, ctx) {
        try {
            const confirmationKeyboard = new InlineKeyboard();
            const { id } = ctx.state;

            if (!id)
                return await ctx.reply('Something went wrong. No monitor selected for deletion.');

            confirmationKeyboard.text('Delete', DELETE_CREATE).text('Cancel', CONFIRM_CANCEL);
            await ctx.reply(ctx.t('are_you_sure'), {
                reply_markup: confirmationKeyboard
            });

            const confirmationCtx = await conversation.waitForCallbackQuery([DELETE_CREATE, CONFIRM_CANCEL], {
                otherwise: ctx => ctx.reply(ctx.t('use_buttons_alert'), { reply_markup: confirmationKeyboard }),
            });

            if (confirmationCtx.match === CONFIRM_CANCEL)
                return await ctx.reply('👍');

            await Monitor.findByIdAndDelete(id);
            await ctx.reply(ctx.t('monitor_deleted'));
        } catch (err) {
            logger.debug('deleteMonitor')(err);

            await ctx.reply('Sorry, there was an error on our side. Please try again later or contact administrator.');
        }
    };
};