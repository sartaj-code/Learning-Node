const exec = require('child_process').exec;

if (process.argv.length !== 3) {
    console.log('What am I supposed to do?');
    process.exit(-1);
}

const cmd = process.platform === 'win32' ? 'type' : 'cat';

exec(`${cmd} ${process.argv[2]}`, (err, stdout, stderr) => {
    console.log(stdout.toString('utf8'));
    console.log(stderr.toString('utf8'));

    if (err) {
        console.log(`ERROR: ${err}`);
    }
});