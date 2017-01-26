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
        }
    });
}

function loadAlbum(albumName, callback) {
    fs.readdir('albums/' + albumName, (err, files) => {
        if (err) {
            if (err.code === 'ENOENT') {
                callback(make_error(`no_such_album`, `That album doesn't exist`));
            } else {
                callback(make_error(`cant_load_photos`, `The server is broken`));
            }
        } else {
            let   photos = [];
            const path = `albums/${albumName}/`;

            const iterator = (index) => {
                if (index === files.length) {
                    const obj = {
                        short_name: albumName,
                        photos: photos
                    };
                    callback(null, obj);
                    return;
                }

                fs.stat(path + files[index], (err, stats) => {
                    if (!err && stats.isFile()) {
                        photos.push(files[index]);
                    }

                    iterator(index + 1);
                });
            };

            iterator(0);
        }
    });
}

function handleIncomingRequest(req, res) {
    console.log(`INCOMING REQUEST: ${req.method} ${req.url}`);

    if (req.url === '/albums.json') {
        handleLoadAlbumList(req, res);
    } else if (req.url.substr(0, 7) === '/albums' && req.url.substr(req.url.length - 5) === '.json') {
        handleLoadAlbum(req, res);
    } else {
        send_failure(res, 404, {code: `no_such_page`, message: `No such page`});
    }
}

function handleLoadAlbumList(req, res) {
    loadAlbumList((err, albums) => {
        if (err) {
            send_failure(res, 500, {code: `cant_load_albums`, message: err.message});
        } else {
            send_success(res, { albums });
        }
    });
}

function handleLoadAlbum(req, res) {
    loadAlbum(req.url.substr(7, req.url.length - 12), (err, photos) => {
        if (err) {
            send_failure(res, 500, err);
        } else {
            send_success(res, photos);
        }
    });
}

const s = http.createServer(handleIncomingRequest);
s.listen(8080);

function make_error(code, msg) {
    let e = new Error(msg);
    e.code = code;
    return e;
}

function make_response_error(err) {
    return JSON.stringify({
        code: (err.code) ? err.code : err.name,
        message: err.message
    });
}

function send_success(res, data) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    const output = {error: null, data: data};
    res.end(JSON.stringify(output) + '\n');
}

function send_failure(res, server_code, err) {
    const code = (err.code) ? err.code : err.name;
    res.writeHead(server_code, {'Content-Type': 'application/json'});
    res.end(make_response_error(err));
}