var debug = require('debug');

const middleware = source => async (ctx, next) => {
    debug(source)('Update Received:');
    debug(source)(ctx.message ?? ctx.update);

    await next();
};

module.exports = middleware;