#!/usr/bin/env node
const fs = require('fs'),
      path = require('path');

const BUFFER_SIZE = 1000000;

function move_file_sync (src, dest) {
    let read_so_far, fdsrc, fddest, read;
    let buff = new Buffer(BUFFER_SIZE);

    fdsrc = fs.openSync(src, 'r');
    fddest = fs.openSync(dest, 'w');
    read_so_far = 0;

    do {
        read = fs.readSync(fdsrc, buff, 0, BUFFER_SIZE, read_so_far);
        fs.writeSync(fddest, buff, 0, read);
        read_so_far += read;
    } while (read > 0);

    fs.closeSync(fdsrc);
    fs.closeSync(fddest);
    return fs.unlinkSync(src);
}


if (process.argv.length != 4) {
    console.log("Usage: " + path.basename(process.argv[1], '.js')
        + " [src_file] [dest_file]");
} else {
    try {
        move_file_sync(process.argv[2], process.argv[3]);
    } catch (e) {
        console.log("Error copying file:");
        console.log(e);
        process.exit(-1);
    }

    console.log("1 file moved.");
}