require('dotenv').config();

const container = require('./app/container');
// const initializeBot = require('./bot');
// const mongo = require('./db/connect');

// try {
//     mongo.connection.once('open', () => {
//         initializeBot();
//     });
// } catch (err) {
//     console.log('ERROR', err);
// }


(async () => {
    try {
        await container.resolve('app').start();
    } catch (err) {
        console.error('Application Start Error:', err);
    }
})();