const Twit = require('twit');
const unique = require('unique-random-array');
const config = require('../config');
const handleError = require('../handleError');
const rando = require('../rando');
const retweet = require('./retweet');

const param = config.twitterConfig;
const queryString = unique(param.queryString.split(','));

const bot = new Twit(config.twitterKeys);

//get date string for today's date (e.g. '2011-01-01')
function datestring() {
    var d = new Date(Date.now() - 5 * 60 * 60 * 1000);  //est timezone
    return d.getUTCFullYear() + '-'
        + (d.getUTCMonth() + 1) + '-'
        + d.getDate();
}

var quoteTweet = function () {
    var query = queryString();
    //var query = 'from:Fisher85M -filter:retweets -filter:replies';
    var params = {
        q: query,
        result_type: param.resultType,
        lang: param.language,
        filter: 'safe',
        count: param.searchCount,
        since: datestring()
    };

    bot.get('search/tweets', params, function (err, data) {
        if (err) return handleError(err);

        const rando = Math.floor(Math.random() * data.statuses.length);
        var tweet = data.statuses[rando];

        // Filter a bit more on Tweets we don't want.
        if (tweet.user.screen_name === 'techcpu_ebooks') return;    // No repeats!
        if (tweet.text.indexOf('RT') >= 0) return;                  // No IFTTT!
        if (tweet.text.indexOf('#mpgvip') >= 0) return;             // No bot tagging!
        if (tweet.text.indexOf('#makeyourownlane') >= 0) return;    // No bot tagging!
        if (tweet.text.indexOf('#defstar5') >= 0) return;           // No bot tagging!

        var tweetBody = tweet.text + ' @' + tweet.user.screen_name;

        // Clean up the tweet.
        // trimTweetURLs - Remove URLs from the tweet.
        // removeExtraSpaces - Remove extra spaces from the tweet.
        // removeCR - Remove Carriage Returns.
        // removePeriods - Remove continuation periods (...)
        var trimTweetURLs = tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        var removeExtraSpaces = trimTweetURLs.replace(/ +(?= )/g, '');
        var removeCR = removeExtraSpaces.replace(/[\n\r]+/g, ' ');
        var removePeriods = removeCR.replace(/…/g, '');

        // Put the tweet together.
        var quoteBody = removePeriods + 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;

        bot.post('statuses/update', {status: quoteBody}, function (err, response) {
            if (response) {
                console.log('\n[Quote Tweet ' + '(' + rando + ')' + ']: ' + quoteBody)
            }
            if (err) return handleError(err);

        });
    })
};

module.exports = quoteTweet;