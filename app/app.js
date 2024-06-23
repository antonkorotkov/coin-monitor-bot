class App {
    #db;
    #mongoose;
    #log;
    #marketsService;
    #bot;

    constructor(options) {
        this.#mongoose = options.mongoose;
        this.#db = options.db;
        this.#log = options.logger.debug(this.constructor.name);
        this.#marketsService = options.marketsService;
        this.#bot = options.bot;

        this.#log('Initializing...');
    }

    async start() {
        this.#mongoose.connection.once('open', async () => {
            this.#log('Connected to database!');

            await this.#marketsService.watch(changed => {
                this.#log(changed.length);
            });

            this.#bot.start();
        });

        await this.#db();
    } 
};

module.exports = App;