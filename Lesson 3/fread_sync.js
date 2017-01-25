
const fs = require('fs');

const f = fs.openSync('test.txt', 'r');

let buf = new Buffer(1000000);
let bytes_read = fs.readSync(f, buf, 0, 1000000);

console.log(buf.toString('utf8', 0, bytes_read));
