const express = require('express');

const app = express();

app.get('/users/:userid', function (req, res) {
    res.end(`You asked for user: ${req.params.userid}`);
});

app.get('*', function (req, res) {
    res.end('Hello, Express world!');
});

app.listen(8080);