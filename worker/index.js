require('dotenv').config();
const amqp = require('amqplib');
const { Api } = require('grammy');
const debug = require('debug')('WORKER');
const { connectToDatabase, mongoose } = require('./db/database');
const Monitor = require('./db/schemas/Monitor');

const amqpConnectionString = process.env.AMQP_CONNECTION_STRING ?? 'amqp://localhost';
const dbConnectionString = process.env.DB_CONNECTION_STRING ?? 'mongodb://localhost:27017/coinMonitor'
const queueName = process.env.AMQP_QUEUE_NAME ?? 'marketChanges';
const apiToken = process.env.API_TOKEN;

const start = async () => {
    try {
        const connection = await amqp.connect(amqpConnectionString);
        const channel = await connection.createChannel();
        const api = new Api(apiToken);

        await channel.assertQueue(queueName, {
            durable: true
        });

        channel.consume(queueName, async msg => {
            if (!msg)
                return;

            const messageString = msg.content.toString();
            const [coinId, priceString] = messageString.split(':');
            const price = parseFloat(priceString);

            const monitors = await Monitor.find({ coinId });

            debug('Found: ' + coinId + ' - ' + price);
            for (const monitor of monitors) {
                await api.sendMessage(monitor.telegramId, "Yo!");
            }

            channel.ack(msg);
        });
    } catch (error) {
        debug(`Error: ${error.message}`);
    }
};

mongoose.connection.once('open', () => {
    debug('Connected to database.');
    start();
});

connectToDatabase(dbConnectionString);