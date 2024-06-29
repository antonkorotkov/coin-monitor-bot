const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    telegramId: {
        type: String,
        unique: true,
        immutable: true
    },
    nickname: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean
    }
});

UserSchema.statics.createOrUpdate = function ({
    telegramId, nickname, firstName, lastName
}) {
    return this.findOneAndUpdate(
        { telegramId },
        { $set: { nickname, firstName, lastName, isActive: true }, $setOnInsert: { createdAt: Date.now() } },
        { new: true, upsert: true }
    );
};

UserSchema.statics.deactivate = function (telegramId) {
    return this.findOneAndUpdate(
        { telegramId },
        { $set: { isActive: false } }
    );
};

const User = model('User', UserSchema);

module.exports = User;