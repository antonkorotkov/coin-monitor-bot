module.exports = {
    dbConnectionString: process.env.DB_CONNECTION_STRING ?? 'mongodb://localhost:27017/coinMonitor',
    telegramBotToken: process.env.BOT_TOKEN,
    wciApiKey: process.env.WCI_KEY,
    amqpConnectionString: process.env.AMQP_CONNECTION_STRING ?? 'amqp://localhost',
    amqpQueueName: process.env.AMQP_QUEUE_NAME ?? 'marketChanges'
};