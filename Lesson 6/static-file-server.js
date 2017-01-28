const http = require('http');
const fs = require('fs');

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

    rs.on('readable', () => {
        let d = rs.read();

        if (d) {
            if (typeof d === 'string') {
                res.write(d);
            } else if (typeof d === 'object' && d instanceof Buffer) {
                res.write(d.toString('utf8'));
            }
        }

    });

    rs.on('end', () => {
        res.end();
    });

}

function contentTypeForPath (path) {
    return 'text/html';
}

const server = http.createServer(handleIncomingRequest);

server.listen(8080);