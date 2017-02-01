const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      session = require('express-session');

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'Cats on the keyboard',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1800000 }
}));

// app.post('*', function (req, res) {
//     res.end(JSON.stringify(req.body, 0, 2) + '\n');
// });
//
// app.get('*', function (req, res) {
//     res.end('App.get * was called');
// });

// app.get('*', function (req, res) {
//     res.cookie('pet', 'Zimbu the Monkey', { expires: new Date(Date.now() + 86400000) });
//
//     // To clear out a cookie
//     // res.clearCookie('pet');
//
//     res.end(`Cookies the client sent to me: ${JSON.stringify(req.cookies, 0, 2)}\n`);
// });

app.use(function (req, res) {
    const x = req.session.last_access;

    req.session.last_access = new Date();
    res.end(`You last asked for this page at ${x}`);
});

app.listen(8080);