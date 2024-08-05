class AbstractPersonalizedCache {

    /** @type {Record<number, Record<string, any>>} */
    #cache = {};

    /**
     * @param {number} userId
     * @param {string} entityName
     * @param {any} data
     */
    setUserCacheEntity(userId, entityName, data) {
        if (typeof userId !== 'number')
            throw new Error('userId must be number');

        if (!this.#cache[userId])
            this.#cache[userId] = {};

        this.#cache[userId][entityName] = data;

        return this;
    }

    /**
     * @param {number} userId
     * @param {string} [entityName]
     */
    getUserCache(userId, entityName) {
        if (typeof userId !== 'number')
            throw new Error('userId must be number');

        const userCache = this.#cache[userId];

        if (!userCache)
            return undefined;

        return entityName !== undefined && entityName ? userCache[entityName] : userCache;
    }

    /**
     * @param {number} userId
     * @param {string} [entityName]
     */
    flushUserCache(userId, entityName) {
        if (typeof userId !== 'number')
            throw new Error('userId must be number');

        if (!this.#cache[userId])
            return this;

        if (entityName && this.#cache[userId][entityName]) {
            this.#cache[userId][entityName] = undefined;

            return this;
        }

        this.#cache[userId] = undefined;

        return this;
    }
}

module.exports = AbstractPersonalizedCache;