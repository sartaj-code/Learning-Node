const spawn = require('child_process').spawn;

if (process.argv.length < 3) {
    console.log('Do what now?');
    process.exit(-1);
}

function spawn_node() {
    const node = spawn('node', process.argv.slice(2));

    node.stdout.on('readable', function () {
        const d = node.stdout.read();

        if (d) {
            console.log(`STDOUT: ${d.toString('utf8')}`)
        }
    });

    node.stderr.on('readable', function () {
        const d = node.stderr.read();

        if (d) {
            console.log(`STDERR: ${d.toString('utf8')}`);
        }
    });

    node.on('exit', process_exited);
}

function process_exited() {
    console.error('Unexpected exit - restarting...');

    // If too many restarts, don't bother any more.
    spawn_node();
}

spawn_node();