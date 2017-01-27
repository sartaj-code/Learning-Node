const async = require('async');

async.series({

    numbers: function (cb) {
        setTimeout(() => {
            cb(null, [1, 2, 3]);
        }, 1000);
    },

    letters: function (cb) {
        setTimeout(() => {
            cb(null, ['a', 'b', 'c']);
        }, 2000);
    }

}, function (err, results) {
    console.log(err);
    console.log(results);
});

