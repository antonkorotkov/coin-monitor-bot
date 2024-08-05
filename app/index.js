require('dotenv').config();

const container = require('./container');

(async () => {
    try {
        await container.resolve('app').start();
    } catch (err) {
        console.error('Application Start Error:', err);
    }
})();