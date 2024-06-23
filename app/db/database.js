const mongoose = require('mongoose');

const connectToDatabase = ({ config }) => async () => {
    if (mongoose.connection.readyState !== 1)
        await mongoose.connect(config.dbConnectionString);
};

module.exports = {
    connectToDatabase,
    mongoose
};