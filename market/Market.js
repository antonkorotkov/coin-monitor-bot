module.exports = class Market {
    /** @type {string} */
    #coin;

    /** @type {string} */
    #fiat;

    /** @type {string} */
    #name;

    /** @type {number} */
    #price;

    /** @type {number} */
    #volume;

    /** @type {Date} */
    #lastUpdated;

    /**
     * @param {MarketData} marketData
     */
    constructor(marketData) {
        const [coin, fiat] = marketData.Label.split('/');

        this.#coin = coin;
        this.#fiat = fiat;
        this.#name = marketData.Name;
        this.#price = marketData.Price;
        this.#volume = marketData.Volume_24h;
        this.#lastUpdated = new Date(marketData.Timestamp);
    }

    getCoin() {
        return this.#coin;
    }

    getFiat() {
        return this.#fiat;
    }

    getPrice() {
        return this.#price;
    }

    getVolume() {
        return this.#volume;
    }

    getLastUpdated() {
        return this.#lastUpdated;
    }

    getName() {
        return this.#name;
    }
};