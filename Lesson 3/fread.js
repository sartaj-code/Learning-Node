const fs = require('fs');

function FileObject() {

    this.filename = '';

    // (err, bool)
    this.file_exists = function (callback) {
        console.log(`About to open: ${this.filename}`);

        fs.open(this.filename, 'r', (err, handle) => {
            if (err) {
                console.log(`Can't open: ${this.filename}`);
                callback(err);
                return;
            }

            fs.close(handle);
            callback(null, true)
        });
    };
}

const fo = new FileObject();

fo.filename = "something that does not exist";
fo.file_exists((err, exist) => {
    if (err) {
        console.log(`Error opening file: ${JSON.stringify(err)}`);
        return;
    }
});

