const http = require('http');
const fs = require('fs');
const path = require('path');

function handleIncomingRequest(req, res) {

    if (req.method.toLowerCase() === 'get' && req.url.substring(0, 9) === '/content/') {
        serveStaticFile(req.url.substring(9), res);
    } else {
        res.writeHead(404, { "Content-Type": "application/json"});

        const out = {
            error: 'not_found',
            message: `'${req.url} not found`
        };

        res.end(JSON.stringify(out) + '\n');
    }
}

function serveStaticFile(filename, res) {
    console.log(filename);

    const rs = fs.createReadStream(filename);
    const ct = contentTypeForPath(filename);

    res.writeHead(200, { 'Content-Type': ct });

/*
    rs.on('readable', () => {
        let d = rs.read();

        if (d) {
            let strToWrite;

            if (typeof d === 'string') {
                strToWrite = d;
            } else if (typeof d === 'object' && d instanceof Buffer) {
                strToWrite = d.toString('utf8');
            }

            // Throttle back if necessary - writes may be slow (see 'drain' event later)
            if (!res.write(strToWrite)) {
                rs.pause();
            }
        }

    });

    // Continuess with writing to stream after pause
    rs.on('drain', () => {
        rs.resume();
    });

    rs.on('end', () => {
        res.end();
    });
 */

    rs.on('error', (err) => {
        res.writeHead(404, { 'Content-Type': 'application/json' });

        const out = {
            error: "not_found",
            message: `${filename} was not found`
        };

        res.end(JSON.stringify(out) + '\n');
    });

    // pipe replaces setting up 'readable', 'drain' and 'end' events
    rs.pipe(res);
}

function contentTypeForPath (filename) {
    const ext = path.extname(filename);

    switch (ext.toLowerCase()) {
        case '.html': return 'text/html';
        case '.css': return 'text/css';
        case '.jpg': case '.jpeg': return 'image/jeg';
        default: return 'text/plain';
    }
}

const server = http.createServer(handleIncomingRequest);

server.listen(8080);