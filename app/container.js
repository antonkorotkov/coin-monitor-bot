const { createContainer, asClass, asValue, asFunction } = require('awilix');

const config = require('./config');
const { connectToDatabase, mongoose } = require('./db/database');
const App = require('./app');

const container = createContainer({
    strict: true
});

container.register({
    config: asValue(config),
    mongoose: asValue(mongoose),
    db: asFunction(connectToDatabase).singleton(),
    app: asClass(App)
});

module.exports = container;