const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION_STRING)
    .catch(err => console.error(err))
    .then(() => console.log('Connected to DataBase.'));

module.exports = mongoose;