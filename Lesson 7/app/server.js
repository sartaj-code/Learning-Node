const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      album_mgr = require('./handlers/album_mgr'),
      page_mgr = require('./handlers/page_mgr');

const app = express();

app.use(require('morgan')('dev'));
app.use(require('response-time')());

// Custom middleware
// app.use(function (req, res, next) {
//     if (req.url === '/STOP') {
//         res.end("STOPPED!\n");
//     } else {
//         console.log(`Don't stop!!\n`);
//         next();
//     }
// });


app.get('/v1/albums.json', album_mgr.albumList);
app.get('/v1/albums/:album_name.json', album_mgr.loadAlbum);

app.get('/content/:file_name', function (req, res) {
    serveStaticFile('content/' + req.params.file_name, res);
});

app.get('/templates/:file_name', function (req, res) {
    serveStaticFile('templates/' + req.params.file_name, res);
});

app.get('/pages/:page_name', page_mgr.servePage);

app.get('*', function (req, res) {
    send_failure(res, 404, {code: `no_such_page`, message: `No such page`});
});

app.listen(8080);


function serveStaticFile(filename, res) {
    console.log(filename);

    const rs = fs.createReadStream(filename);
    const ct = contentTypeForPath(filename);

    res.writeHead(200, { 'Content-Type': ct });

    rs.on('error', (err) => {
        console.log("ERROR: on read stream");

        res.writeHead(404, { 'Content-Type': 'application/json' });

        const out = {
            error: "not_found",
            message: `${filename} was not found`
        };

        res.end(JSON.stringify(out) + '\n');
    });

    rs.pipe(res);
}

function contentTypeForPath (filename) {
    const ext = path.extname(filename);

    switch (ext.toLowerCase()) {
        case '.html': return 'text/html';
        case '.css': return 'text/css';
        case '.js': return 'application/json';
        case '.jpg': case '.jpeg': return 'image/jeg';
        default: return 'text/plain';
    }
}

function make_response_error(err) {
    return JSON.stringify({
        code: (err.code) ? err.code : err.name,
        message: err.message
    });
}

function send_failure(res, server_code, err) {
    const code = (err.code) ? err.code : err.name;
    res.writeHead(server_code, {'Content-Type': 'application/json'});
    res.end(make_response_error(err));
}
