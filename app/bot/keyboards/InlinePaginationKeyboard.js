const { InlineKeyboard } = require("grammy");
const AbstractPersonalizedCache = require("./AbstractPersonalizedCache");

/**
 * @template T
 * @typedef {T} Item
 */

class InlinePaginationKeyboard extends AbstractPersonalizedCache {
    #cachePrefix = 'pagination_';

    /**
     * @type {number}
     */
    #perPage;

    /**
     * @type {number}
     */
    #maxVisiblePages;

    /**
     * @type {(i: Item) => string}
     */
    #renderItem;

    /**
     * @type {(i: Item) => string}
     */
    #resolveItemId;

    /**
     * @param {string} name
     * @returns {string}
     */
    getCacheKey(name) {
        return `${this.#cachePrefix}${name}`;
    }

    /**
     * @param {import('grammy').Bot} bot
     * @param {{
     *  onItemClick: (itemId: string, ctx: import('grammy').Context) => void;
     *  perPage?: number;
     *  renderItem: (i: Item) => string;
     *  resolveItemId: (i: Item) => string;
     * }} options
     */
    init(bot, options) {
        const { perPage = 5, maxVisiblePages = 5, renderItem, resolveItemId, onItemClick } = options;

        this.#renderItem = renderItem;
        this.#resolveItemId = resolveItemId;
        this.#perPage = perPage;
        this.#maxVisiblePages = maxVisiblePages;

        bot.on("callback_query:data", async (ctx, next) => {
            if (ctx.callbackQuery.data.includes('pagination:')) {
                const userId = ctx.from.id;
                const [, page] = ctx.callbackQuery.data.split(':');
                const pageNumber = parseInt(page);

                if (pageNumber !== this.#getCurrentPage(userId)) {
                    this.#setCurrentPage(userId, pageNumber);

                    await ctx.editMessageReplyMarkup({
                        reply_markup: this.getMarkup(userId)
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
     * @param {number} userId
     * @param {Item[]} items
     */
    setItems(userId, items) {
        const totalItems = items.length - 1;

        this.#setCurrentPage(userId, 0);
        this.setUserCacheEntity(userId, this.getCacheKey('items'), items);
        this.setUserCacheEntity(userId, this.getCacheKey('totalItems'), totalItems);
        this.#setTotalPages(userId, Math.ceil(totalItems/this.#perPage));
    }

    /**
     * @param {number} userId
     * @param {number} totalPages
     * @returns {this}
     */
    #setTotalPages(userId, totalPages) {
        return this.setUserCacheEntity(userId, this.getCacheKey('totalPages'), totalPages);
    }

    /**
     * @param {number} userId
     * @returns {number}
     */
    #getTotalPages(userId) {
        return this.getUserCache(userId, this.getCacheKey('totalPages')) ?? 0;
    }

    /**
     * @param {number} userId
     * @returns {Array}
     */
    #getPageItems(userId) {
        const currentPage = this.getUserCache(userId, this.getCacheKey('currentPage')) ?? 0;
        const items = this.getUserCache(userId, this.getCacheKey('items')) ?? [];
        const start = currentPage * this.#perPage;

        return items.slice(start, start + this.#perPage);
    }

    /**
     * @param {number} userId
     * @param {number} page
     * @returns {this}
     */
    #setCurrentPage(userId, page) {
        return this.setUserCacheEntity(userId, this.getCacheKey('currentPage'), page);
    }

    /**
     * @param {number} userId
     * @returns {number}
     */
    #getCurrentPage(userId) {
        return this.getUserCache(userId, this.getCacheKey('currentPage')) ?? 0;
    }

    /**
     * @param {number} userId
     * @returns {Array}
     */
    #generatePagination(userId) {
        const pagination = [];
        const current = this.#getCurrentPage(userId) + 1;
        const totalPages = this.#getTotalPages(userId) ?? 0;

        // Calculate the start and end of the visible page range
        let startPage = Math.max(1, current - Math.floor(this.#maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + this.#maxVisiblePages - 1);

        startPage = Math.max(1, endPage - this.#maxVisiblePages + 1);

        if (totalPages > this.#maxVisiblePages && current > Math.ceil(this.#maxVisiblePages / 2)) {
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

        if (totalPages > this.#maxVisiblePages && totalPages - current > Math.floor(this.#maxVisiblePages / 2)) {
            pagination.push({
                type: 'last',
                page: totalPages
            });
        }

        return pagination;
    }

    /**
     * @param {number} userId
     * @returns {InlineKeyboard}
     */
    getMarkup(userId) {
        const keyboard = new InlineKeyboard();
        const totalPages = this.#getTotalPages(userId) ?? 0;

        this.#getPageItems(userId).forEach(item => {
            keyboard.row().text(this.#renderItem(item), `itemClick:${this.#resolveItemId(item)}`);
        });

        if (totalPages > 1) {
            const pagination = this.#generatePagination(userId);

            keyboard.row();
            pagination.forEach(p => {
                if (p.type === 'first')
                    keyboard.text('« 1', 'pagination:0');

                if (p.type === 'last')
                    keyboard.text(`${totalPages} »`, `pagination:${totalPages - 1}`);

                if (p.type === 'page')
                    keyboard.text(p.current ? `[${p.page}]` : `${p.page}`, `pagination:${p.page - 1}`);
            });
        }

        return keyboard;
    }
}

module.exports = InlinePaginationKeyboard;