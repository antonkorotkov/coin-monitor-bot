const logger = async (ctx, next) => {
    console.log('LOGGER', ctx.message ?? ctx.update);
    await next();
};

module.exports = logger;