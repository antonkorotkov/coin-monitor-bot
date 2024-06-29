const { default: expect } = require('expect');
const AbstractPersonalizedCache = require('./AbstractPersonalizedCache');

describe('AbstractPersonalizedCache', () => {

    /** @type {AbstractPersonalizedCache} */
    let cache;

    before(() => {
        cache = new AbstractPersonalizedCache();
    });

    it('should store user cache entity', () => {
        expect(() => {
            cache.setUserCacheEntity(1, 'key', [1, 2, 3])
        }).not.toThrow();
    })

    it('should return user cache', () => {
        const userCache = cache.getUserCache(1);
        expect(userCache).toHaveProperty('key', [1, 2, 3]);
    });

    it('should return user cache entity', () => {
        const userCache = cache.getUserCache(1, 'key');
        expect(userCache).toEqual([1, 2, 3]);
    });

    it('should flush user cache entity', () => {
        expect(cache.flushUserCache(1, 'key').getUserCache(1, 'key')).toBe(undefined);
        expect(cache.flushUserCache(1).getUserCache(1)).toBe(undefined);
    });

    it('should throw when used incorrectly', () => {
        expect(() => {
            cache.setUserCacheEntity('key');
        }).toThrow();

        expect(() => {
            cache.getUserCache('key');
        }).toThrow();

        expect(() => {
            cache.flushUserCache('key');
        }).toThrow();
    });
});