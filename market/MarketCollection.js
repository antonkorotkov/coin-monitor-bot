const Market = require("./Market");

const round = num => {
    return Math.ceil(num * 1000000) / 1000000;
}

module.exports = class MarketCollection {
    /** @type {Market[]} */
    #markets = [];

    /** @type {MarketCollectionOptions['onMarketsChange']} */
    #onMarketsChange = () => {};

    #interval = 60_000;
    #apiUrl = 'https://www.worldcoinindex.com/apiservice/v2getmarkets';
    #apiKey = process.env.WCI_KEY;
    #fiat = 'USD';

    /**
     * @param {MarketCollectionOptions} [options]
     */
    constructor(options = {}) {
        const { onMarketsChange } = options;

        if (onMarketsChange)
            this.#onMarketsChange = onMarketsChange;
    }

    /**
     * @returns {Promise<MarketData[]>}
     */
    async #fetchMarkets() {
        try {
            const response = await fetch(`${this.#apiUrl}?key=${this.#apiKey}&fiat=${this.#fiat}`);
            const json = await response.json();

            if (json.Markets && Array.isArray(json.Markets) && Array.isArray(json.Markets.at(0)))
                return json.Markets.at(0);
        } catch (err) {
            console.error('ERROR', err);
            return Promise.reject(err.message);
        }
    }

    async refresh() {
        try {
            const changes = [];
            const marketsData = await this.#fetchMarkets();

            console.log('received markets data', marketsData.length);

            marketsData.sort((a, b) => a.Name.localeCompare(b.Name)).forEach(marketData => {
                const foundIndex = this.#markets.findIndex(m => m.getName() === marketData.Name);

                if (foundIndex >= 0) {
                    const oldPrice = round(this.#markets[foundIndex].getPrice());
                    const newPrice = round(marketData.Price);
                    if (oldPrice !== newPrice) {
                        console.log('change found', oldPrice, newPrice);
                        changes.push(new Market(marketData));
                    }

                    this.#markets[foundIndex] = new Market(marketData);
                }
                else {
                    this.#markets.push(new Market(marketData));
                }
            });

            if (changes.length)
                this.#onMarketsChange(changes);
        } catch (err) {
            console.error('ERROR', err);
        }

        setTimeout(() => {
            this.refresh();
        }, this.#interval);
    }

    /**
     * @param {string} phrase
     * @returns {Market[]}
     */
    findMarkets(phrase) {
        const searchPhrase = phrase.toLowerCase();

        return this.#markets.filter(
            market => market.getName().toLowerCase().includes(searchPhrase) || market.getCoin().toLowerCase().includes(searchPhrase)
        );
    }

    /**
     * @param {string} coin
     * @returns {Market}
     */
    getMarketByCoin(coin) {
        return this.#markets.find(m => m.getCoin() === coin);
    }
}