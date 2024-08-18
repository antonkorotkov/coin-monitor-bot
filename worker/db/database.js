const mongoose = require('mongoose');
const debug = require('debug')('DB');

const connectToDatabase = async (dbConnectionString) => {
    if (mongoose.connection.readyState !== 1) {
        debug('Connecting...');
        await mongoose.connect(dbConnectionString);
    }
};

module.exports = {
    connectToDatabase,
    mongoose
};