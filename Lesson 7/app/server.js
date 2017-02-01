const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      album_mgr = require('./handlers/album_mgr'),
      page_mgr = require('./handlers/page_mgr');

const app = express();

app.use(require('morgan')('dev'));
app.use(require('response-time')());
app.use(express.static(__dirname + "/public"));

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

app.get('/pages/:page_name', page_mgr.servePage);
app.get('/pages/admin/home', verify_admin, page_mgr.servePage);
app.get('/pages/:page_name/:sub_page', page_mgr.servePage);


app.get('*', function (req, res) {
    send_failure(res, 404, {code: `no_such_page`, message: `No such page`});
});

app.listen(8080);


function verify_admin(req, res, next) {
    console.log("verify_admin");
    if (isAdmin()) {
        next();
    } else {
        send_failure(res, 403, { code: "permission_denied", message: `You can't do that!` });
    }
}

function isAdmin() {
    return false;
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
