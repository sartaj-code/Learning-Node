const events = require('events');

function Downloader() {

}

Downloader.prototype = new events.EventEmitter();
Downloader.prototype.__proto__ = events.EventEmitter.prototype;
Downloader.prototype.url = null;

Downloader.prototype.download = function (path) {
    const self = this;

    self.url = path;
    self.emit('start', path);

    setTimeout(function () {
        self.emit('end', 'Simulated contents of file');
    }, 2000);
};

const d = new Downloader();

d.on('start', (path) => {
    console.log(`Started downloading: ${path}`);
});

d.on('end', (contents) => {
    console.log(`Finished downloading and got:\n  ${contents}`);
});

d.download('http://example.org');