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

MonitorSchema.statics.createOrUpdate = function ({
    telegramId, coinId, ...data
}) {
    return this.findOneAndUpdate(
        { telegramId, coinId },
        { $set: data },
        { new: true, upsert: true }
    );
};

const Monitor = model('Monitor', MonitorSchema);

module.exports = Monitor;