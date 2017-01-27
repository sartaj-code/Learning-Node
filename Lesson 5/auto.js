const async = require('async');

async.auto({

    numbers: function (cb) {
        setTimeout(() => {
            cb(null, [1, 2, 3]);
        }, 1000);
    },

    letters: function (cb) {
        setTimeout(() => {
            cb(null, ['a', 'b', 'c']);
        }, 2000);
    },

    assemble: [ 'numbers', 'letters', (thus_far, cb) => {
        cb(null, {
            numbers: thus_far.numbers.join(', '),
            letters: "'" + thus_far.letters.join("', '") + "'"
        });
    }]

}, function (err, results) {
    console.log(err);
    console.log(results);
});

