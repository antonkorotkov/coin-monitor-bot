require('dotenv').config();
const initializeBot = require('./bot');
const mongo = require('./db/connect');

try {
    mongo.connection.once('open', () => {
        initializeBot();
    });
} catch (err) {
    console.log('ERROR', err);
}