const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MonitorSchema = new Schema({
    telegramId: {
        type: String,
        immutable: true,
        required: true
    },
    coinId: {
        type: String,
        required: true
    },
    coin: {
        type: String,
        required: true
    },
    coinName: {
        type: String,
        required: true
    },
    lastPrice: {
        type: Number,
        required: true
    },
    threshold: {
        value: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true
        }
    }
});

/**
 * @param {{ type: 'percentage' | 'fixed', value: number }} threshold
 * @param {number} lastPrice
 * @returns {number}
 */
const getExpectedDiff = ({ type, value }, lastPrice) => {
    if (type === 'fixed')
        return value;

    if (type === 'percentage') {
        return lastPrice / 100 * value;
    }

    return 0;
};

/**
 * @param {number} newPrice
 * @returns {boolean}
 */
MonitorSchema.methods.shouldNotify = function (newPrice) {
    const monitorObject = this.toObject();
    const expectedDiff = getExpectedDiff(monitorObject.threshold, monitorObject.lastPrice);

    if (!expectedDiff)
        return false;

    if (Math.abs(newPrice - monitorObject.lastPrice) >= expectedDiff)
        return true;

    return false;
};

/**
 * @param {number} price
 */
MonitorSchema.methods.updateLastPrice = function (price) {
    return this.updateOne({
        lastPrice: price
    });
};

const Monitor = model('Monitor', MonitorSchema);

module.exports = Monitor;