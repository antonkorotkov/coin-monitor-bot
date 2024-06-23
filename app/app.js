class App {
    #db;
    #mongoose;

    constructor(options) {
        this.#mongoose = options.mongoose;
        this.#db = options.db;
    }

    async start() {
        this.#mongoose.connection.once('open', () => {
            console.log('Connected to database!');
        });

        await this.#db();
    } 
};

module.exports = App;