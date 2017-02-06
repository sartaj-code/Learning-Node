const express = require('express'),
      evh = require('express-vhost');

const one = express();
one.get('*', function (req, res) {
    res.end('1\n');
});

const two = express();
two.get('*', function (req, res) {
    res.end('2\n');
});

const three = express();
three.get('*', function (req, res) {
    res.end('3\n');
});

const masterApp = express();
masterApp.use(evh.vhost());

evh.register("app1", one);
evh.register("app2", two);
evh.register("app3", three);

masterApp.listen(8080);