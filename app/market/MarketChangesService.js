const AMQP = require('../amqp');

class MarketChangesService extends AMQP {
    #queueName;

    constructor({ config }) {
        super(config.amqpConnectionString);
        this.#queueName = config.amqpQueueName;
    }

    /**
     * @param {import('./Market')} market
     * @returns {Buffer}
     */
    #formatMessage(market) {
        return Buffer.from(`${market.getId()}:${market.getPrice()}`);
    }

    /**
     * @param {import('./Market')} market
     */
    async push(market) {
        const channel = await this.getChannel(this.#queueName);

        channel.sendToQueue(this.#queueName, this.#formatMessage(market), {
            persistent: true
        });

        await channel.waitForConfirms();
    }
}

module.exports = MarketChangesService;