const { InlineKeyboard } = require("grammy");
const Monitor = require("../../db/schemas/Monitor");

const TYPE_FIXED = 'fixed';
const TYPE_PERCENTAGE = 'percentage';
const CONFIRM_CREATE = 'create';
const CONFIRM_CANCEL = 'cancel';

module.exports = ({ logger }) => _ => {
    return async function addMonitorConversation(conversation, ctx) {
        const typeKeyboard = new InlineKeyboard();
        typeKeyboard.text(ctx.t('monitor_type_fixed'), TYPE_FIXED).text(ctx.t('monitor_type_percentage'), TYPE_PERCENTAGE);

        await ctx.reply(ctx.t('monitor_type_prompt'), {
            reply_markup: typeKeyboard
        });

        const monitorTypeCtx = await conversation.waitForCallbackQuery([TYPE_FIXED, TYPE_PERCENTAGE], {
            otherwise: ctx => ctx.reply(ctx.t('use_buttons_alert'), { reply_markup: typeKeyboard }),
        });

        await monitorTypeCtx.editMessageText(ctx.t('monitor_threshold_prompt', { type: monitorTypeCtx.match === TYPE_PERCENTAGE ? '%' : '$' }), {
            reply_markup: undefined
        });

        const value = await conversation.form.number(
            ctx => ctx.reply(ctx.t('monitor_number_validation'), { parse_mode: 'HTML' })
        );

        if (value <= 0 || value > 1_000_000)
            return await ctx.reply(ctx.t('monitor_bad_threshold'));

        const confirmationKeyboard = new InlineKeyboard();
        confirmationKeyboard.text('Create', CONFIRM_CREATE).text('Cancel', CONFIRM_CANCEL);
        await ctx.reply(`You are about to create a <b>${monitorTypeCtx.match}</b> price monitor for <code>${ctx.state.coin}</code> with the threshold of ${value}${monitorTypeCtx.match === TYPE_PERCENTAGE ? '%' : '$'}`, {
            parse_mode: 'HTML',
            reply_markup: confirmationKeyboard
        });

        const confirmationCtx = await conversation.waitForCallbackQuery([CONFIRM_CREATE, CONFIRM_CANCEL], {
            otherwise: ctx => ctx.reply(ctx.t('use_buttons_alert'), { reply_markup: confirmationKeyboard }),
        });

        if (confirmationCtx.match === CONFIRM_CANCEL)
            return await ctx.reply('😒');

        try {
            await Monitor.createOrUpdate({
                telegramId: ctx.chat.id,
                coinId: ctx.state.id,
                coin: ctx.state.coin,
                lastPrice: ctx.state.price,
                threshold: {
                    type: monitorTypeCtx.match,
                    value: value
                }
            });

            await ctx.reply(ctx.t('monitor_created'));
        } catch (err) {
            logger.debug('addMonitor')(err);

            await ctx.reply('Sorry, there was an error on our side. Please try again later or contact administrator.');
        }
    };
};