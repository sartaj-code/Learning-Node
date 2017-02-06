const express = require('express'),
      https = require('https'),
      fs = require('fs');

const privateKey = fs.readFileSync('privkey.pem').toString();
const certificate = fs.readFileSync('newcert.pem').toString();

const options = {
    key: privateKey,
    cert: certificate
};

const app = express();

app.get('*', function (req, res) {
    res.end('Thanks for calling (securely)!!!');
});

const portNumber = 8443;

https.createServer(options, app).listen(portNumber, function () {
    console.log(`Express server listening on port ${portNumber}`);
});