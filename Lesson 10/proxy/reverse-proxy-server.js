const http = require('http'),
      httpProxy = require('http-proxy'),
      fs = require('fs');

let serverList = JSON.parse(fs.readFileSync('server-list.json')).server_list;

// 1. Create proxy server
const proxy = httpProxy.createProxyServer({});

// 2. Create regular HTTP server on 8080
const server = http.createServer(function (req, res) {
    const target = serverList.shift();

    proxy.web(req, res, {
        target: target
    });

    serverList.push(target);
});

server.listen(8080);
