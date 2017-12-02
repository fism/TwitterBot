const Twit = require('twit');
const config = require('./config');

function handleError(err) {
    console.error('message: ', err.message);
    console.error('http:', err.statusCode);
    console.error('data:', err.data);
}

module.exports = handleError;