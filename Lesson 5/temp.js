const async = require('async');

let dirs = [];

async.forEachSeries(
    files,
    
    (element, cb) => {
        fs.stat('albums/' + files[index], (err, stats) => {
            if (stats.isDirectory()) {
                dirs.push(files[index]);
            }

            cb(null);
        });
    },
    
    function (err) {
        
    }
);

// This is replaced by above async.forEachSeries
let iterator = (index) => {
    if (index === files.length) {
        callback(null, dirs);
        return;
    }

    fs.stat('albums/' + files[index], (err, stats) => {
        if (stats.isDirectory()) {
            dirs.push(files[index]);
        }

        iterator(index + 1);
    });
};

iterator(0);
