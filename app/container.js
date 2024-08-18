const { createContainer, asClass, asValue, asFunction } = require('awilix');

const config = require('./config');
const logger = require('./logger');
const { connectToDatabase, mongoose } = require('./db/database');
const App = require('./app');
const MarketsService = require('./market/MarketsService');
const MarketChangesService = require('./market/MarketChangesService');
const TelegramBot = require('./bot/TelegramBot');
const { searchConversation, addMonitorConversation, deleteMonitorConversation } = require('./bot/conversations');
const InlinePaginationKeyboard = require('./bot/keyboards/InlinePaginationKeyboard');
const MarketDetailsKeyboard = require('./bot/keyboards/MarketDetailsKeyboard');

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
    marketChangesService: asClass(MarketChangesService).singleton(),
    telegramBot: asClass(TelegramBot).singleton(),
    conversationSearch: asFunction(searchConversation).singleton(),
    conversationAddMonitor: asFunction(addMonitorConversation).singleton(),
    conversationDeleteMonitor: asFunction(deleteMonitorConversation).singleton(),
    inlinePaginationKeyboard: asClass(InlinePaginationKeyboard).singleton(),
    marketDetailsKeyboard: asClass(MarketDetailsKeyboard).singleton()
});

module.exports = container;