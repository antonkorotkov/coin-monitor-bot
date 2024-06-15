const { InlineKeyboard } = require("grammy");

/**
 * @template T
 * @typedef {T} Item
 */

class InlinePaginationKeyboard {

    /**
     * @type {InlineKeyboard}
     */
    #keyboard;

    /**
     * @type {Item[]}
     */
    #items;

    /**
     * @type {number}
     */
    #totalItems;

    /**
     * @type {number}
     */
    #perPage;

    /**
     * @type {number}
     */
    #maxVisiblePages;

    /**
     * @type {number}
     */
    #currentPage = 0;

    /**
     * @type {number}
     */
    #totalPages;

    /**
     * @type {(i: Item) => string}
     */
    #renderItem;

    /**
     * @param {{ perPage?: number, renderItem: (i: Item) => string }} options
     */
    constructor(options) {
        const { perPage = 5, maxVisiblePages = 5, renderItem } = options;

        this.#renderItem = renderItem;
        this.#perPage = perPage;
        this.#maxVisiblePages = maxVisiblePages;
    }

    init(bot) {
        bot.on("callback_query:data", async (ctx) => {
            console.log("Unknown button event with payload", ctx.callbackQuery.data);
            await ctx.answerCallbackQuery(); // remove loading animation
        });

        return this;
    }

    /**
     * @param {Item[]} items
     */
    setItems(items) {
        this.#items = items;
        this.#totalItems = items.length - 1;
        this.#totalPages = Math.ceil(this.#totalItems/this.#perPage);
    }

    #getPageItems() {
        return this.#items.slice(this.#currentPage, this.#currentPage + this.#perPage);
    }

    firstPage() {

        return this;
    }

    nextPage() {

        return this;
    }

    prevPage() {

        return this;
    }

    lastPage() {

        return this;
    }

    #generatePagination() {
        const pagination = [];
        const current = this.#currentPage + 1;

        if (current > 1) {
            pagination.push({
                type: 'first',
                page: 1
            });
        }

        // Calculate the start and end of the visible page range
        let startPage = Math.max(1, current - Math.floor(this.#maxVisiblePages / 2));
        const endPage = Math.min(this.#totalPages, startPage + this.#maxVisiblePages - 1);

        startPage = Math.max(1, endPage - this.#maxVisiblePages + 1);

        for (let i = startPage; i <= endPage; i++) {
            pagination.push({
                type: 'page',
                page: i,
                current: i === current
            });
        }

        if (current < this.#totalPages) {
            pagination.push({
                type: 'last',
                page: this.#totalPages
            });
        }

        return pagination;
    }

    /**
     * @returns {InlineKeyboard}
     */
    getMarkup() {
        this.#keyboard = new InlineKeyboard();

        this.#getPageItems().forEach(item => {
            this.#keyboard.row().text(this.#renderItem(item));
        });

        if (this.#totalPages > 1) {
            const pagination = this.#generatePagination();

            this.#keyboard.row();
            pagination.forEach(p => {
                if (p.type === 'first')
                    this.#keyboard.text('« 1');

                if (p.type === 'last')
                    this.#keyboard.text(`${this.#totalPages} »`);

                if (p.type === 'page')
                    this.#keyboard.text(p.page);
            });
        }

        return this.#keyboard;
    }
}

module.exports = InlinePaginationKeyboard;