const Twit = require('twit');
const config = require('./config');
const bot = new Twit(config.twitterKeys);
const retweet = require('./api/retweet');
const quoteTweet = require('./api/quoteRetweet');

console.log('Emerging Technologies Bot has started!');

quoteTweet();

setInterval(quoteTweet, 1800000);
