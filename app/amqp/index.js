const amqp = require('amqplib');

class AMQP {
    #connection;

    /** @type {amqp.ConfirmChannel | undefined} */
    #channel;

    /**
     * @param {string} connectionString
     */
    constructor(connectionString) {
        this.#connection = amqp.connect(connectionString);
    }

    /**
     * @param {string} queueName
     * @returns {Promise<amqp.ConfirmChannel>}
     */
    async getChannel(queueName) {
        if (!this.#channel) {
            this.#channel = await (await this.#connection).createConfirmChannel();

            await this.#channel.assertQueue(queueName, {
                durable: true
            });
        }

        return this.#channel;
    }

    async closeChannel() {
        await this.#channel.close();
        this.#channel = undefined;
    }
}

module.exports = AMQP;