class App {
    #db;
    #mongoose;
    #log;

    /** @type {import('./market/MarketsService')} */
    #marketsService;

    /** @type {import('./market/MarketChangesService')} */
    #marketChangesService;
    #telegramBot;

    constructor(options) {
        this.#mongoose = options.mongoose;
        this.#db = options.db;
        this.#log = options.logger.debug(this.constructor.name);
        this.#marketsService = options.marketsService;
        this.#marketChangesService = options.marketChangesService;
        this.#telegramBot = options.telegramBot;

        this.#log('Initializing...');
    }

    async start() {
        this.#mongoose.connection.once('open', async () => {
            this.#log('Connected to database!');

            await this.#marketsService.watch(async changedMarkets => {
                for (const market of changedMarkets) {
                    await this.#marketChangesService.push(market);
                }

                await this.#marketChangesService.closeChannel();
            });

            this.#telegramBot.start();
        });

        await this.#db();
    } 
};

module.exports = App;