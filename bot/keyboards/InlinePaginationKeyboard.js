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
            if (ctx.callbackQuery.data.includes('pagination:')) {
                const [, page] = ctx.callbackQuery.data.split(':');
                const pageNumber = parseInt(page);

                if (pageNumber !== this.#currentPage) {
                    this.#setCurrent(pageNumber);

                    ctx.editMessageReplyMarkup({
                        reply_markup: this.getMarkup()
                    });
                }
            }

            await ctx.answerCallbackQuery();
        });

        return this;
    }

    /**
     * @param {Item[]} items
     */
    setItems(items) {
        this.#currentPage = 0;
        this.#items = items;
        this.#totalItems = items.length - 1;
        this.#totalPages = Math.ceil(this.#totalItems/this.#perPage);
    }

    #getPageItems() {
        return this.#items.slice(this.#currentPage, this.#currentPage + this.#perPage);
    }

    #setCurrent(page) {
        this.#currentPage = page;
        return this;
    }

    #generatePagination() {
        const pagination = [];
        const current = this.#currentPage + 1;

        if (current > Math.ceil(this.#maxVisiblePages / 2)) {
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

        if (this.#totalPages - current > Math.floor(this.#maxVisiblePages / 2)) {
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
                    this.#keyboard.text('« 1', 'pagination:0');

                if (p.type === 'last')
                    this.#keyboard.text(`${this.#totalPages} »`, `pagination:${this.#totalPages - 1}`);

                if (p.type === 'page')
                    this.#keyboard.text(p.current ? `[${p.page}]` : `${p.page}`, `pagination:${p.page - 1}`);
            });
        }

        return this.#keyboard;
    }
}

module.exports = InlinePaginationKeyboard;