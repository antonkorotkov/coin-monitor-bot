const mongoose = require('mongoose');

const connectToDatabase = ({ config, logger }) => async () => {
    if (mongoose.connection.readyState !== 1) {
        logger.debug('DB')('Connecting...');
        await mongoose.connect(config.dbConnectionString);
    }
};

module.exports = {
    connectToDatabase,
    mongoose
};