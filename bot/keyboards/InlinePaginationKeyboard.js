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
    #currentPage = 0;

    /**
     * @type {number}
     */
    #totalPages;

    #renderItem;

    /**
     * @param {Item[]} items
     * @param {{ perPage?: number, renderItem: (i: Item) => string }} options
     */
    constructor(items, options) {
        const { perPage = 5, renderItem } = options;

        this.#renderItem = renderItem;
        this.#items = items;
        this.#perPage = perPage;
        this.#totalItems = items.length - 1;
        this.#totalPages = Math.ceil(this.#totalItems/perPage);
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

    #generatePagination(currentPage, totalPages, maxVisiblePages = 5) {
        const pagination = [];

        if (currentPage > 1) {
            pagination.push({
                type: 'first',
                page: 1
            });
        }

        // Calculate the start and end of the visible page range
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust the start page if end page is less than max visible pages
        startPage = Math.max(1, endPage - maxVisiblePages + 1);

        // Add page buttons
        for (let i = startPage; i <= endPage; i++) {
            pagination.push({
                type: 'page',
                page: i,
                current: i === currentPage
            });
        }

        // Add "Last" button
        if (currentPage < totalPages) {
            pagination.push({
                type: 'last',
                page: totalPages
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
            const pagination = this.#generatePagination(this.#currentPage + 1, this.#totalPages);

            this.#keyboard.row();
            pagination.forEach(p => {
                if (p.type === 'first')
                    this.#keyboard.text('«');

                if (p.type === 'last')
                    this.#keyboard.text('»');

                if (p.type === 'page')
                    this.#keyboard.text(p.page);
            });
        }

        return this.#keyboard;
    }
}

module.exports = InlinePaginationKeyboard;