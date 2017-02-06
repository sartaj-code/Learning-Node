const httpProxy = require('http-proxy'),
      https = require('https'),
      fs = require('fs');

const privateKey = fs.readFileSync('privkey.pem').toString();
const certificate = fs.readFileSync('newcert.pem').toString();

const options = {
    key: privateKey,
    cert: certificate
};

const proxyServer = httpProxy.createProxyServer({});
const portNumber = 8443;

https.createServer(options, function (req, res) {
    proxyServer.web(req, res, { target: 'http://localhost:8081'});
}).listen(portNumber);
