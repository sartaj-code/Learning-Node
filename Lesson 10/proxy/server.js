const express = require('express'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      MemcachedStore = require('connect-memcached')(session);

const portNumber = process.argv[2];

const app = express()
    .use(cookieParser())
    .use(session({
        secret: "Cat on keyboard",
        cookie: { maxAge: 1800000 },
        resave: false,
        saveUninitialized: true,
        store: new MemcachedStore({
            hosts: ['localhost:12321']
        })
    }))
    .use(function (req, res) {
        let x = req.session.last_access;

        console.log(`Received request on: ${portNumber}`);
        req.session.last_access = new Date();
        res.end(`You last accessed this page on port ${portNumber} at ${x}`);
    });


app.listen(portNumber);