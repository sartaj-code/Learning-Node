const fs = require('fs');

let contents = '';
const rs = fs.createReadStream('test.txt');

rs.on('readable', () => {
    let str;
    let d = rs.read();

    if (d) {
        if (typeof d === 'string') {
            str = d;
        } else if (typeof d === 'object' && d instanceof Buffer) {
            str = d.toString('utf8', 0, d.length);
        }

        if (str) {
            contents += str;
        }
    }
});

rs.on('end', () => {
    console.log('Read in the file contents: ');
    console.log(contents.toString('utf8'));
});

rs.on('error', (err) => {
    console.log(`Error reading stream: ${JSON.stringify(err)}`);
});