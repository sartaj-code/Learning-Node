const express = require('express');

const one = express();

one.get('*', function (req, res) {
    console.log(req);
    res.send(`\nWhat part of 'highly classified' do you not understand?`);
});

one.listen(8081);