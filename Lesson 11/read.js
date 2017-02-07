#!/usr/bin/env node

const crypto = require('crypto');

process.stdout.write('> ');

process.stdin.on('readable', () => {
    const d = process.stdin.read();

    if (d && d === '\n') {
        process.exit(0);
    } else if (d !== null) {
        const h = crypto.createHash('md5');
        const s = h.update(d).digest('hex');

        console.log(s);

        process.stdout.write('> ');
    }
});

process.stdin.setEncoding('utf8');
// process.stdin.resume();