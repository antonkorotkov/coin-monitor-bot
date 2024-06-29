const round = require("../utils/round");
const Market = require("./Market");

const apiUrl = 'https://www.worldcoinindex.com/apiservice/v2getmarkets';
const fetchInterval = 60_000;

class MarketsService {
    #log;
    #apiKey;
    #onChange;
    #markets = [];

    constructor({ logger, config }) {
        this.#log = logger.debug(this.constructor.name);
        this.#apiKey = config.wciApiKey;

        this.#log('Initializing...');
    }

    async watch(onChange) {
        try {
            if (onChange && !this.#onChange)
                this.#onChange = onChange;

            const changes = [];
            const marketsData = await this.#fetch();

            marketsData.sort((a, b) => a.Name.localeCompare(b.Name)).forEach(marketData => {
                const foundIndex = this.#markets.findIndex(m => m.getName() === marketData.Name);

                if (foundIndex !== -1) {
                    const oldPrice = round(this.#markets[foundIndex].getPrice());
                    const newPrice = round(marketData.Price);
                    if (oldPrice !== newPrice) {
                        this.#log('%s price changed: %s -> %s', this.#markets[foundIndex].getCoin(), oldPrice, newPrice);
                        changes.push(new Market(marketData));
                    }

                    this.#markets[foundIndex] = new Market(marketData);
                }
                else {
                    this.#markets.push(new Market(marketData));
                }
            });

            if (changes.length && this.#onChange)
                this.#onChange(changes);
        } catch (err) {
            this.#log('ERROR:', err);
        }

        setTimeout(() => {
            this.watch();
        }, fetchInterval);
    }

    async #fetch() {
        try {
            this.#log('Fetching markets...');
            const response = await fetch(`${apiUrl}?key=${this.#apiKey}&fiat=USD`);
            const json = await response.json();

            if (json.Markets && Array.isArray(json.Markets) && Array.isArray(json.Markets.at(0))) {
                this.#log('Markets retrieved:', json.Markets.at(0).length);
                return json.Markets.at(0);
            }

        } catch (err) {
            this.#log('ERROR:', err);
            return Promise.reject(err.message);
        }
    }

    findMarkets(phrase) {
        const searchPhrase = phrase.toLowerCase();

        return this.#markets.filter(
            market => market.getName().toLowerCase().includes(searchPhrase) || market.getCoin().toLowerCase().includes(searchPhrase)
        );
    }

    getMarketByCoin(coin) {
        return this.#markets.find(m => m.getCoin() === coin);
    }
}

module.exports = MarketsService;