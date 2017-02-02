const express = require('express'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      flash = require('express-flash'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

const app = express();

app.use(flash());
app.use(session({
    secret: 'Cat on the keyboard',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }       // development only
}));
app.use(cookieParser('Cat on the keyboard'));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 1. Store usernames and passwords
let users = {
    'id123': { id: 123, username: "glenp", password: 'boo'},
    'id1': { id: 1, username: "admin", password: 'admin'}
};

// 2. Configure passport-local to validate an incoming username and password
passport.use(new LocalStrategy(function (username, password, done) {
    for (userid in users) {
        const user = users[userid];

        if (user.username.toLowerCase() === username.toLowerCase()) {
            if (user.password === password) {
                return done(null, user);
            }
        }
    }

    return done(null, false, { message: 'Incorrect credentials' });
}));

// 3. Serialize users
passport.serializeUser(function (user, done) {
    if (users['id' + user.id]) {
        done(null, 'id' + user.id);
    } else {
        done(new Error(`ERROR: Can't serialize this user`));
    }
});

// 4. De-serialize users
passport.deserializeUser(function (userid, done) {
    if (users[userid]) {
        done(null, users[userid]);
    } else {
        done(new Error(`ERROR: That user does't exist`));
    }
});

app.get('/', function (req, res) {
    res.send('<a href="/login">Login Here</a>');
});

app.get("/login", function (req, res) {
    let error = req.flash("error");

    let form = '<form action="/login" method="post">' +
        '    <div>' +
        '        <label>Username:</label>' +
        '        <input type="text" name="username"/>' +
        '    </div>' +
        '    <div>' +
        '        <label>Password:</label>' +
        '        <input type="password" name="password"/>' +
        '    </div>' +
        '    <div>' +
        '        <input type="submit" value="Log In"/>' +
        '    </div>' +
        '</form>';

    if (error && error.length) {
        form = "<b> " + error[0] + "</b><br/>" + form;
    }

    res.send(form);
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/members',
    failureRedirect: '/login',
    successFlash: 'Welcome back!',
    failureFlash: true
}));

app.get('/members', authenticated, function (req, res) {
    console.log(req.flash('success'));
    res.end('Secret members area only!');
});

function authenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.listen(8080);