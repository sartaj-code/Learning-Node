const http = require('http'),
      qs = require('querystring');

function handle_incoming_request(req, res) {
    console.log(`Incoming request: (${req.method}) ${req.url} `);

    let formData = '';

    // Append chunk of readable data to jsonData.
    req.on('readable', () => {
        let d = req.read();

        if (typeof d === 'string') {
            formData += d;
        } else if (typeof d === 'object' && d instanceof Buffer) {
            formData += d.toString('utf8');
        }
    });

    req.on('end', () => {
        let output = '';

        if (!formData || formData.length === 0) {
            output = `I don't have any form data`;
        } else {
            const obj = qs.parse(formData);

            if (!obj) {
                output = 'No valid form data';
            } else {
                output = `Form data: ${JSON.stringify(obj)}`;
            }
        }

        res.end(output);
    });
}

const server = http.createServer(handle_incoming_request);

server.listen(8080);