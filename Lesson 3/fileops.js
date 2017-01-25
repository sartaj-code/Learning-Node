const fs = require('fs');

let buf = new Buffer(100000);

fs.open('test.txt', 'r', (err, handle) => {

    if (err) {
        console.lgo(`ERROR: ${err.code} (${err.message})`);
        return;
    }

    fs.read(handle, buf, 0, 100000, null, (err, length) => {
        if (err) {
            console.log(`ERROR: ${err.code} (${err.message})`);
        } else {
            console.log(buf.toString('utf8', 0, length));
            fs.close(handle, () => {});
        }
    });
});
