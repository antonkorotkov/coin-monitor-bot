const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MonitorSchema = new Schema({
    telegramId: {
        type: String,
        immutable: true,
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
            enum: ['percent', 'fixed']
        }
    }
});

const Monitor = model('Monitor', MonitorSchema);

module.exports = Monitor;