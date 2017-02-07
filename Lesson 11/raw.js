#!/usr/bin/env node

process.stdin.on('readable', () => {
    const d = process.stdin.read();

    if (d) {
        console.log(`You hit: ${d}, RawMode is: ${process.stdin.isRaw}`);
    }
});

process.stdin.setEncoding('utf8');
process.stdin.setRawMode(true);
