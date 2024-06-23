const { createContainer, asClass, asValue, asFunction } = require('awilix');

const config = require('./config');
const logger = require('./logger');
const { connectToDatabase, mongoose } = require('./db/database');
const App = require('./app');
const MarketsService = require('./market/MarketsService');
const TelegramBot = require('./bot/TelegramBot');

const container = createContainer({
    strict: true
});

container.register({
    config: asValue(config),
    logger: asValue(logger),
    mongoose: asValue(mongoose),
    db: asFunction(connectToDatabase).singleton(),
    app: asClass(App),
    marketsService: asClass(MarketsService).singleton(),
    bot: asClass(TelegramBot).singleton()
});

module.exports = container;