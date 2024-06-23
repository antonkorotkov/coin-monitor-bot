const { InlineKeyboard } = require("grammy");

/**
 * @template T
 * @typedef {T} Item
 */

class InlinePaginationKeyboard {

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
     * @type {(i: Item) => string}
     */
    #resolveItemId;

    /**
     * @param {{ perPage?: number, renderItem: (i: Item) => string; resolveItemId: (i: Item) => string }} options
     */
    constructor(options) {
        const { perPage = 5, maxVisiblePages = 5, renderItem, resolveItemId } = options;

        this.#renderItem = renderItem;
        this.#resolveItemId = resolveItemId;
        this.#perPage = perPage;
        this.#maxVisiblePages = maxVisiblePages;
    }

    /**
     * @param {import('grammy').Bot} bot
     * @param {{ onItemClick: (itemId: string, ctx: import('grammy').Context) }} options
     */
    init(bot, { onItemClick }) {
        bot.on("callback_query:data", async (ctx, next) => {
            if (ctx.callbackQuery.data.includes('pagination:')) {
                const [, page] = ctx.callbackQuery.data.split(':');
                const pageNumber = parseInt(page);

                if (pageNumber !== this.#currentPage) {
                    this.#setCurrent(pageNumber);

                    await ctx.editMessageReplyMarkup({
                        reply_markup: this.getMarkup()
                    });
                }
            }
            else if (ctx.callbackQuery.data.includes('itemClick:')) {
                const [, itemId] = ctx.callbackQuery.data.split(':');
                onItemClick(itemId, ctx);
            }

            await ctx.answerCallbackQuery();
            await next();
        });
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
        const start = this.#currentPage * this.#perPage;
        return this.#items.slice(start, start + this.#perPage);
    }

    #setCurrent(page) {
        this.#currentPage = page;
        return this;
    }

    #generatePagination() {
        const pagination = [];
        const current = this.#currentPage + 1;

        // Calculate the start and end of the visible page range
        let startPage = Math.max(1, current - Math.floor(this.#maxVisiblePages / 2));
        const endPage = Math.min(this.#totalPages, startPage + this.#maxVisiblePages - 1);

        startPage = Math.max(1, endPage - this.#maxVisiblePages + 1);

        if (this.#totalPages > this.#maxVisiblePages && current > Math.ceil(this.#maxVisiblePages / 2)) {
            pagination.push({
                type: 'first',
                page: 1
            });
        }

        for (let i = startPage; i <= endPage; i++) {
            pagination.push({
                type: 'page',
                page: i,
                current: i === current
            });
        }

        if (this.#totalPages > this.#maxVisiblePages && this.#totalPages - current > Math.floor(this.#maxVisiblePages / 2)) {
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
        const keyboard = new InlineKeyboard();

        this.#getPageItems().forEach(item => {
            keyboard.row().text(this.#renderItem(item), `itemClick:${this.#resolveItemId(item)}`);
        });

        if (this.#totalPages > 1) {
            const pagination = this.#generatePagination();

            keyboard.row();
            pagination.forEach(p => {
                if (p.type === 'first')
                    keyboard.text('« 1', 'pagination:0');

                if (p.type === 'last')
                    keyboard.text(`${this.#totalPages} »`, `pagination:${this.#totalPages - 1}`);

                if (p.type === 'page')
                    keyboard.text(p.current ? `[${p.page}]` : `${p.page}`, `pagination:${p.page - 1}`);
            });
        }

        return keyboard;
    }
}

module.exports = InlinePaginationKeyboard;