const express = require('express'),
      morgan = require('morgan'),
      multer = require('multer');

const app = express();

app.use(morgan('dev'));

const upload = multer({ dest: 'uploads/' });

app.post('/uploadtest', upload.single('file-to-upload'), function (req, res) {
    console.log(JSON.stringify(req.body, 0, 2));
    res.end(JSON.stringify(req.file, 0, 2) + '\n');
});

app.listen(8080);