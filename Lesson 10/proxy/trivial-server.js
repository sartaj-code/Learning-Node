const http = require('http');

const port = process.argv[2];

const server = http.createServer(function (req, res) {
    console.log(`I got a request on port: ${port}`);
    res.end(`I was listening on port; ${port}\n`);
});

server.listen(port);