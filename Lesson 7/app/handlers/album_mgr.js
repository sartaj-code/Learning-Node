const fs = require('fs'),
      helpers = require('./helpers');

exports.version = '0.1.0';

exports.albumList = function (req, res) {
    loadAlbumList((err, albums) => {
        if (err) {
            helpers.send_failure(res, 500, {code: `cant_load_albums`, message: err.message});
        } else {
            helpers.send_success(res, { albums });
        }
    });
};

exports.loadAlbum = function (req, res) {

    const params = req.query;
    let pageNum = params.page ? parseInt(params.page) - 1: 0;
    let pageSize = params.page_size ? parseInt(params.page_size) : 1000;

    if (isNaN(pageNum)) pageNum = 0;
    if (isNaN(pageSize)) pageSize = 1000;

    const album_name = req.params.album_name;

    loadAlbum(album_name, pageNum, pageSize, (err, photos) => {
        if (err) {
            helpers.send_failure(res, 500, err);
        } else {
            helpers.send_success(res, photos);
        }
    });
};

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
                        dirs.push({
                            album_name: files[index],
                            title: files[index]
                        });
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
                callback(helpers.make_error(`no_such_album`, `That album doesn't exist`));
            } else {
                callback(helpers.make_error(`cant_load_photos`, `The server is broken`));
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
