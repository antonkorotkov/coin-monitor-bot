const round = require("../utils/round");

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

    /** @type {number} */
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
        this.#lastUpdated = marketData.Timestamp * 1000;
    }

    getCoin() {
        return this.#coin;
    }

    getFiat() {
        return this.#fiat;
    }

    getPrice(doRound = false) {
        if (doRound)
            return round(this.#price);

        return this.#price;
    }

    getVolume(doRound = false) {
        if (doRound)
            return round(this.#volume);

        return this.#volume;
    }

    getLastUpdated() {
        return this.#lastUpdated;
    }

    getName() {
        return this.#name;
    }
};