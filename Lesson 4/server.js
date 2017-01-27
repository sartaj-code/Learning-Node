const http = require('http'),
      fs = require('fs'),
      url = require('url');

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

function loadAlbum(albumName, page, pageSize, callback) {

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
                    const start = page * pageSize;
                    const output = photos.slice(start, start + pageSize);

                    const obj = {
                        short_name: albumName,
                        photos: output
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

    req.parsed_url = url.parse(req.url, true);
    const core_url = req.parsed_url.pathname;

    console.log(`INCOMING REQUEST: ${req.method} ${core_url}`);

    if (core_url === '/albums.json') {
        handleLoadAlbumList(req, res);
    } else if (core_url.substr(0, 7) === '/albums' && core_url.substr(core_url.length - 5) === '.json') {
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

    const params = req.parsed_url.query;
    let pageNum = params.page ? parseInt(params.page) - 1: 0;
    let pageSize = params.page_size ? parseInt(params.page_size) : 1000;

    if (isNaN(pageNum)) pageNum = 0;
    if (isNaN(pageSize)) pageSize = 1000;

    const core_url = req.parsed_url.pathname;

    loadAlbum(core_url.substr(7, core_url.length - 12), pageNum, pageSize, (err, photos) => {
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