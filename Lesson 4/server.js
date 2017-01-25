const http = require('http'),
      fs = require('fs');

function loadAlbumList(callback) {
    fs.readdir('albums', (err, files) => {
        if (err) callback(err);
        else {
            let dirs = [];

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

            // N.B. Doesn't work as we haven't waited for the callbacks to
            // process.

            // for (let i = 0; files && i < files.length; ++i) {
            //     fs.stat('albums/' + files[i], (err, stats) => {
            //         if (stats.isDirectory()) {
            //             dirs.push(files[i]);
            //         }
            //     });
            // }
            //
            // callback(null, dirs);
        }
    });
}

function handleIncomingRequest(req, res) {
    console.log(`INCOMING REQUEST: ${req.method} ${req.url}`);

    loadAlbumList((err, albums) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: { code: `Can't load albums`, message: err.message }, data: {} }));
        } else {
            const output = { error: null, data: { albums }};
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(output) + '\n');
        }
    });
}

const s = http.createServer(handleIncomingRequest);

s.listen(8080);
