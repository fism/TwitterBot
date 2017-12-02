const Twit = require('twit');
const unique = require('unique-random-array');
const config = require('../config');
const handleError = require('../handleError');
const rando = require('../rando');

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

var retweet = function () {
    var query = queryString();
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
        var retweetId = data.statuses[rando].id_str;
        bot.post('statuses/retweet/:id', {
                id: retweetId
            },
            function (err, response) {
                if (response) {
                    console.log('[Retweet]:' + data.statuses[rando].text + ' [ID]: ' + retweetId + ' [Rando ID]: ' + rando);
                }
                if (err) return handleError(err);
            });
        if (err) return handleError(err);
    })

};

module.exports = retweet;